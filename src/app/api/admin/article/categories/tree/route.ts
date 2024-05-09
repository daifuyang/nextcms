import { getArticleCagegoryTree } from "@/model/articleCategory";
import prisma from "@/utils/prisma";
import api from "@/utils/response";
import { isNumberEmpty } from "@/utils/validator";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const where: Prisma.cmsArticleCategoryWhereInput | undefined = {
    deletedAt: 0
  };
  const name = searchParams.get("name") || "";
  if (name) {
    where.name = {
      contains: name
    };
  }
  const status = searchParams.get("status") || "";
  const statusInt = parseInt(status);
  if (!isNumberEmpty(status)) {
    where.status = statusInt;
  }

  const categories = await getArticleCagegoryTree({
    where
  });
  return api.success("获取成功！", categories);
}
