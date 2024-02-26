import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { apiHandler } from "@/utils/api";

const prisma = new PrismaClient();

export async function articleList(request: NextRequest) {}

// 新增
export async function addArticle(request: NextRequest) {
  const params: any = await request.json();
  return NextResponse.json({ success: params });
}

module.exports = {
  GET: apiHandler(articleList),
  POST: apiHandler(addArticle)
};
