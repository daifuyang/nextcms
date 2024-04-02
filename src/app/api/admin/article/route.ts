import { type NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/utils/api";
import api from '@/utils/response';
import prisma from "@/utils/prisma";

export async function articleList(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  // 先获取所有的文章数量
  const total = prisma.cmsArticle.count();

  // 获取所有文章，分页
  const offset = (current - 1) * pageSize
  const articles = await prisma.cmsArticle.findMany({
    skip: offset,
    take: pageSize,
  })
  
  return api.success("获取成功！")
}

// 新增
export async function addArticle(request: NextRequest) {
  const params: any = await request.json();
  return NextResponse.json({ success: params });
}

module.exports = {
  GET: articleList,
  POST: apiHandler(addArticle)
};
