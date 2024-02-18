import { type NextRequest } from "next/server";
import prisma from "@/model";
import { apiHandler, success, error } from "@/utils/api";
import _ from "lodash";
import path from "path";
import fs from "fs";

async function pageList(request: NextRequest) {
  const params: any = (await request.nextUrl.searchParams) || {};
  const page = params.get('page') || 1
  const pageSize = params.get('pageSize') || 10

  // 无分页
  if(pageSize == 0) {
    const list = await prisma.cmsPage.findMany({
      orderBy: {
        id: "desc"
      }
    });
    return success("获取成功！", list);
  }

  // 有分页
  const total = await prisma.cmsPage.count()
  const list = await prisma.cmsPage.findMany({
    take: pageSize,
    skip: pageSize * (page - 1),
    orderBy: {
      id: "desc"
    }
  });

  const pagination = {
    data: list,
    page,
    pageSize,
    total
  }

  return success("获取成功！", pagination);
}

// 新增
export async function addPage(request: NextRequest) {
  const params = (await request.json()) || {};
  const { title, description, isHome = false, schema = {} } = params;

  if (isHome) {
    await prisma.cmsPage.updateMany({
      where: {
        isHome: true
      },
      data: {
        isHome: false
      }
    });
  }

  // 先入库
  let page = await prisma.cmsPage.create({
    data: {
      title,
      description,
      filePath: "",
      isHome,
      version: 1,
      createId: 1,
      creator: "admin",
      updateId: 1,
      updater: "admin"
    }
  });

  const key = page.id;
  const filePath = `schema/page-${key}.json`;
  const file = path.resolve(process.cwd(), filePath);

  try {
    fs.writeFileSync(file, JSON.stringify(schema));
  } catch (err) {
    return error("新增失败！", err);
  }

  page = await prisma.cmsPage.update({
    where: {
      id: page.id
    },
    data: {
      filePath: filePath
    }
  });

  // 存入日志表中
  await prisma.cmsPagelog.create({
    data: {
      title,
      description,
      filePath,
      isHome,
      version: 1,
      createId: 1,
      creator: "admin"
    }
  });

  return success("新增成功！", page);
}

module.exports = {
  GET: apiHandler(pageList),
  POST: apiHandler(addPage)
};
