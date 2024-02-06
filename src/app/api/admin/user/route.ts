import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ICreateUserParams, createUser } from "../../../../model/user";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {}

// 新增
export async function POST(request: NextRequest) {
  const params: any = await request.json();
  const res = createUser({ ...params, createId: 1, creator: 1, updateId: 1, updater: "admin" });
  return NextResponse.json({ success: res });
}
