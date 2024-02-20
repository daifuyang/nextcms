import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { apiHandler, success, error } from "@/utils/api";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return error("用户不存在！");
  }

  // 验证token
  const usereToken = await prisma.cmsUserToken.findFirst({
    where: {
      accessToken,
      expiry: {
        gt: new Date() // 没有失效
      }
    }
  });
  if (usereToken?.userId) {
    const user = await prisma.cmsUser.findFirst({
      where: {
        id: usereToken?.userId
      }
    });

    return success("获取成功！", user);
  }
  return error("用户不存在！");
}

module.exports = {
  GET: apiHandler(GET)
};
