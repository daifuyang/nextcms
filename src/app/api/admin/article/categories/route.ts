import prisma from "@/utils/prisma";
import { NextRequest } from "next/server";
import api from "@/utils/response";

export async function categoryList(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  // 先获取所有的文章数量
  const total = prisma.cmsArticleCategory.count();

  // 获取所有文章，分页
  const offset = (current - 1) * pageSize;
  const categories = await prisma.cmsArticleCategory.findMany({
    skip: offset,
    take: pageSize
  });

  return api.success("获取成功！", categories);
}

export async function addCategory(request: NextRequest) {
  return api.success("添加成功！");
}

module.exports = {
  GET: categoryList,
  POST: addCategory
};
