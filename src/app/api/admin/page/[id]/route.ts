import { type NextRequest } from "next/server";
import { apiHandler, success, error } from "@/utils/api";
import prisma from "@/model";
import path from "path";
import fs from "fs";
import _ from "lodash";

export async function show(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const idNumber = Number(id);
  if (idNumber <= 0 || Number.isNaN(idNumber)) {
    return error("该页面不存在或参数错误！");
  }

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
  if (filePath) {
    const file = path.resolve(process.cwd(), filePath);
    const jsonData = fs.readFileSync(file, "utf8");
    page.schema = JSON.parse(jsonData);
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
  const { title = page.title, description = page.description, isHome = page.isHome, schema = page.schema } = json;
  const nextVersion = version + 1;
  const key = page.id;
  const filePath = `schema/page-${key}-${nextVersion}.json`;
  const file = path.resolve(process.cwd(), filePath);

  try {
    fs.writeFileSync(file, JSON.stringify(schema));
  } catch (err) {
    return error("新增失败！", err);
  }

  // 更新页面
  page = await prisma.cmsPage.update({
    where: {
      id: Number(id)
    },
    data: {
      title,
      description,
      filePath,
      isHome,
      version: nextVersion,
      createId: 1,
      creator: "admin",
      updateId: 1,
      updater: "admin"
    }
  });

  // 存入日志表中
  await prisma.cmsPagelog.create({
    data: {
      title,
      description,
      filePath,
      isHome,
      version: nextVersion,
      createId: 1,
      creator: "admin"
    }
  });

  return success("更新成功！", page);
}

module.exports = {
  GET: apiHandler(show),
  POST: apiHandler(update)
};
