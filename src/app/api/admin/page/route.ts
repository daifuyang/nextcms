import { type NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import api from "@/utils/response";
import _ from "lodash";
import path from "path";
import fs from "fs";
import { getPageList } from "@/model/page";
import { timestamp } from "@/utils/date";

async function pageList(request: NextRequest) {
  const params: any = (await request.nextUrl.searchParams) || {};
  const current = params.get("current") || 1;
  const pageSize = params.get("pageSize") || 10;
  const res = await getPageList({
    current,
    pageSize
  });

  return api.success("获取成功！", res);
}

// 新增
export async function addPage(request: NextRequest) {
  const params = (await request.json()) || {};
  const { title, description, type = "page", schema = {} } = params;

  if (type == "home") {
    await prisma.cmsPage.updateMany({
      where: {
        type: "home"
      },
      data: {
        type: "page"
      }
    });
  }

  // 先入库
  let page = await prisma.cmsPage.create({
    data: {
      title,
      description,
      filePath: "",
      type,
      version: 1,
      createId: 1,
      creator: "admin",
      updateId: 1,
      updater: "admin",
      createdAt: timestamp(),
      updatedAt: timestamp()
    }
  });

  const key = page.id;
  const filePath = `schema/page-${key}.json`;
  const file = path.resolve(process.cwd(), filePath);

  try {
    fs.writeFileSync(file, JSON.stringify(schema));
  } catch (err) {
    return api.error("新增失败！", err);
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
  await prisma.cmsPageLog.create({
    data: {
      title,
      description,
      filePath,
      type,
      version: 1,
      createId: 1,
      creator: "admin",
      createdAt: timestamp()
    }
  });

  return api.success("新增成功！", page);
}

module.exports = {
  GET: pageList,
  POST: addPage
};
