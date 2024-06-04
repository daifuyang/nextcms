import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient, cmsUser } from "@prisma/client";
import { ICreateUserParams, createUser, getUserTotal, getUserList } from "@/model/user";
import api from "@/utils/response";
import { Pagination } from "@/typings/pagination";

const prisma = new PrismaClient();

// 获取用户分页列表
export async function GET(request: NextRequest) {
  // 获取分页
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const total = await getUserTotal();
  const userList = await getUserList(current, pageSize);

  let pagination: Pagination | cmsUser[] = userList;

  if (pageSize > 0) {
    pagination = {
      current,
      pageSize,
      data: userList,
      total
    };
  }

  return api.success("获取成功", pagination);
}

// 新增
export async function POST(request: NextRequest) {
  const params: any = await request.json();
  const user = createUser({ ...params, createId: 1, creator: 1, updateId: 1, updater: "admin" });
  return api.success("新增成功", user);
}
