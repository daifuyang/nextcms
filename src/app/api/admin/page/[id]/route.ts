import { type NextRequest } from "next/server";
import { success, error } from "@/utils/api";
import prisma from "@/utils/prisma";
import path from "path";
import fs from "fs";
import _ from "lodash";
import { getFileSchema, assignSchema } from "@/utils/util";

export async function show(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const idNumber = Number(id);
  if (idNumber <= 0 || Number.isNaN(idNumber)) {
    return error("该页面不存在或参数错误！");
  }

  // 获取公共头和公共页脚
  const header: any = await prisma.cmsPage.findFirst({
    where: {
      type: "header"
    }
  });

  const headerSchema = getFileSchema(header?.filePath);

  const footer: any = await prisma.cmsPage.findFirst({
    where: {
      type: "footer"
    }
  });

  const footerSchema = getFileSchema(footer?.filePath);

  const page: any = await prisma.cmsPage.findFirst({
    where: {
      id: Number(id)
    }
  });

  if (!page) {
    return error("该页面不存在！");
  }

  // 读取本地schema文件
  const filePath = page?.filePath;
  let schema = getFileSchema(filePath);
  assignSchema(schema, headerSchema, "start");
  assignSchema(schema, footerSchema);

  if (schema) {
    page.schema = schema;
  }
  return success("获取成功！", page);
}

export async function update(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const idNumber = Number(id);
  if (idNumber <= 0 || Number.isNaN(idNumber)) {
    return error("该页面不存在或参数错误！");
  }

  // 查询该页面是否还存在
  let page: any = await prisma.cmsPage.findFirst({
    where: {
      id: Number(id)
    }
  });

  if (!page) {
    return error("该页面不存在！");
  }

  const { version } = page;
  const json = await request.json();
  const {
    title = page.title,
    description = page.description,
    type = page.type,
    schema = page.schema
  } = json;
  const nextVersion = version + 1;
  const key = page.id;
  const filePath = `schema/page-${key}-${nextVersion}.json`;
  const file = path.resolve(process.cwd(), filePath);
  await prisma.$transaction(async (tx: any) => {
    // 获取公共页头和公共页脚
    let headerSchema: any = schema?.children?.find((n: any) => n.componentName === "Header");
    // 查询头页面是否存在
    savePublicPage("header", headerSchema, tx);

    let footerSchema: any = schema?.children?.find((n: any) => n.componentName === "Footer");
    savePublicPage("footer", footerSchema, tx);

    fs.writeFileSync(file, JSON.stringify(schema));

    // 更新页面
    page = await tx.cmsPage.update({
      where: {
        id: Number(id)
      },
      data: {
        filePath,
        version: nextVersion,
        updateId: 1,
        updater: "admin"
      }
    });

    // 存入日志表中
    await tx.cmsPageLog.create({
      data: {
        title,
        description,
        filePath,
        type,
        version: nextVersion,
        createId: 1,
        creator: "admin"
      }
    });
  });
  return success("更新成功！", page);
}

export async function savePublicPage(type: string, schema: any, tx = prisma) {
  // 先查询页面是否存在
  let page: any = await tx.cmsPage.findFirst({
    where: {
      type
    }
  });

  // 读取本地schema文件

  let oldSchema = "";
  const pageSchema = getFileSchema(page?.filePath);
  if (pageSchema) {
    oldSchema = JSON.stringify(pageSchema);
  }
  const newSchema = schema?.componentName === _.upperFirst(type) ? JSON.stringify(schema) : "";

  // 不存在则新增
  let filePath = `schema/${type}.json`;
  let version = 1;
  if (!page) {
    const file = path.resolve(process.cwd(), filePath);

    fs.writeFileSync(file, newSchema);

    console.log("tx", tx);

    page = await tx.cmsPage.create({
      data: {
        title: type == "header" ? "公共页头" : "公共页脚",
        description: "header" ? "公共页头" : "公共页脚",
        filePath,
        type,
        version,
        createId: 1,
        creator: "admin",
        updateId: 1,
        updater: "admin"
      }
    });
  } else if (oldSchema !== newSchema) {
    version = page.version + 1;
    filePath = `schema/${type}-${version}.json`;
    const file = path.resolve(process.cwd(), filePath);
    fs.writeFileSync(file, JSON.stringify(schema));
    page = await tx.cmsPage.update({
      where: {
        id: page.id
      },
      data: {
        filePath,
        version,
        updateId: 1,
        updater: "admin"
      }
    });
  }

  // 存入日志表中
  await tx.cmsPageLog.create({
    data: {
      title: type == "header" ? "公共页头" : "公共页脚",
      description: "header" ? "公共页头" : "公共页脚",
      filePath,
      type,
      version,
      createId: 1,
      creator: "admin"
    }
  });
}

module.exports = {
  GET: show,
  PUT: update
};
