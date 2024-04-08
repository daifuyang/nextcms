import prisma from "@/utils/prisma";
import { NextRequest } from "next/server";
import api from "@/utils/response";
import getCurrentUser from "@/utils/user";
import { count } from "console";
import { isNumberEmpty } from "@/utils/validator";

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

  return api.success("获取成功！", { total, data: categories, current, pageSize });
}

export async function addCategory(request: NextRequest) {
  const json = await request.json();

  const { parentId, name, description, icon, order, status } = json;

  const { userId, loginName } = getCurrentUser(request);

  // 判断parentId是否存在
  if (isNumberEmpty(parentId)) {
    return api.error("父级分类不能为空！");
  }

  // 判断分类名称是否存在，不允许添加重复值
  const exist = await prisma.cmsArticleCategory.findFirst({
    where: {
      name
    }
  });

  if (exist) {
    return api.error("分类名称已存在！");
  }

  const path = parentId ? `0-${parentId}` : "0";
  const count = 0;

  // 不存在则新增分类
  const category = await prisma.cmsArticleCategory.create({
    data: {
      parentId,
      name,
      description,
      icon,
      order,
      count,
      path,
      status,
      createId: userId,
      creator: loginName,
      updateId: userId,
      updater: loginName
    }
  });

  return api.success("添加成功！", category);
}

module.exports = {
  GET: categoryList,
  POST: addCategory
};
