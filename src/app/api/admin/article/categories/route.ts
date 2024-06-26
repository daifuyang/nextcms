import prisma from "@/utils/prisma";
import { NextRequest } from "next/server";
import api from "@/utils/response";
import getCurrentUser from "@/utils/user";
import { isNumberEmpty } from "@/utils/validator";
import redis from "@/utils/redis";
import { now } from "@/utils/date";
import { stringify } from "@/utils/util";
import {
  createArticleCategory,
  getArticleCategory,
  getArticleCategoryCount,
  getArticleCategoryList
} from "@/model/articleCategory";
import { saveRoute } from "@/model/route";

const routeKey = "/category/";

export const categoryIdKey = "nextcms:article:category:id:";

async function categories(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  // 先获取所有的文章数量
  const total = await getArticleCategoryCount();

  // 获取所有文章，分页
  const categories = await getArticleCategoryList({
    current,
    pageSize
  });

  return api.success("获取成功！", { total, data: categories, current, pageSize });
}

async function addCategories(request: NextRequest) {
  const json = await request.json();

  const { parentId, name, alias, description, icon, order, status } = json;

  const { userId, loginName } = getCurrentUser(request);

  // 判断parentId是否存在
  if (isNumberEmpty(parentId)) {
    return api.error("父级分类不能为空！");
  }

  // 判断分类名称是否存在，不允许添加重复值
  const exist = await getArticleCategory({
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
  const category = await prisma.$transaction(async (tx) => {
    const category = await createArticleCategory({
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
      updater: loginName,
      createdAt: now(),
      updatedAt: now()
    });

    if (category && alias) {
      // 创建别名
      await saveRoute(
        {
          fullUrl: alias,
          url: `${routeKey}${category.id}`
        },
        tx
      );
    }

    return category;
  });
  const key = `${categoryIdKey}${category.id}`;
  redis.set(key, stringify(category));
  return api.success("添加成功！");
}

module.exports = {
  GET: categories,
  POST: addCategories
};
