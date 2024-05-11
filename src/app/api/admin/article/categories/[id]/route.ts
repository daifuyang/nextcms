import prisma from "@/utils/prisma";
import api from "@/utils/response";
import getCurrentUser from "@/utils/user";
import { isNumberEmpty } from "@/utils/validator";
import { NextRequest } from "next/server";
import { now } from "@/utils/date";
import {
  getArticleCategory,
  getArticleCategoryById,
  updateArticleCategory
} from "@/model/articleCategory";
import { getRouteByUrl, saveRoute } from "@/model/route";

interface Params {
  id: string;
}

const routeKey = '/category/'

export async function getCategory(request: NextRequest, context: { params: Params }) {
  const id = Number(context.params.id);
  // 获取单个分类
  const category = await getArticleCategoryById(id);

  // 获取分类别名
  if(category) {
    const route = await getRouteByUrl(`${routeKey}${category.id}`)
    if(route) {
      (category as any).alias = route.fullUrl
    }
  }

  return api.success("获取成功！", category);
}

export async function updateCategory(request: NextRequest, context: { params: Params }) {
  const id = Number(context.params.id);
  const json = await request.json();
  const { parentId, name, alias, description, icon, order, status } = json;
  const { userId, loginName } = getCurrentUser(request);
  // 判断parentId是否存在
  if (isNumberEmpty(parentId)) {
    return api.error("父级分类不能为空！");
  }
  // 获取当前分类
  const old = await getArticleCategoryById(id);
  // 判断分类名称是否存在，不允许添加重复值
  if (name !== old?.name) {
    const exist = await getArticleCategory({
      where: {
        name
      }
    });
    if (exist) {
      return api.error("分类名称已存在！");
    }
  }
  const path = parentId ? `0-${parentId}` : "0";
  const count = 0;
  // 不存在则新增分类

  const category = await prisma.$transaction(async (tx) => {
    const category = await updateArticleCategory(id, {
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

    return category
  });

  return api.success("更新成功！", category);
}

export async function deleteCategory(request: NextRequest, context: { params: Params }) {
  const id = Number(context.params.id);

  const category = await getArticleCategoryById(id);

  if (!category) {
    return api.error("分类不存在！");
  }
  // 查询是否存在子集分类
  const children = await getArticleCategory({
    where: {
      parentId: Number(id)
    }
  });
  if (children) {
    return api.error("存在子分类，清先删除子分类！");
  }
  const del = await updateArticleCategory(id, {
    deletedAt: now()
  });
  return api.success("删除成功！", category);
}

module.exports = {
  GET: getCategory,
  PUT: updateCategory,
  DELETE: deleteCategory
};
