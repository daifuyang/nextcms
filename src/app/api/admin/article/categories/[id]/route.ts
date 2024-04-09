import prisma from "@/utils/prisma";
import api from "@/utils/response";
import getCurrentUser from "@/utils/user";
import { isNumberEmpty } from "@/utils/validator";
import { time } from "console";
import { NextRequest } from "next/server";

type Params = {
  id: string;
};

export async function getCategory(request: NextRequest, context: { params: Params }) {
  const id = Number(context.params.id);

  // 获取单个分类
  const category = await prisma.cmsArticleCategory.findFirst({
    where: {
      id
    }
  });

  return api.success("获取成功！",category);
}

export async function updateCategory(request: NextRequest, context: { params: Params }) {
  const id = Number(context.params.id);

  const json = await request.json();

  const { parentId, name, description, icon, order, status } = json;

  const { userId, loginName } = getCurrentUser(request);

  // 判断parentId是否存在
  if (isNumberEmpty(parentId)) {
    return api.error("父级分类不能为空！");
  }

  // 获取当前分类
  const old = await prisma.cmsArticleCategory.findFirst({
    where: {
      id
    }
  });

  // 判断分类名称是否存在，不允许添加重复值
  if (name !== old?.name) {
    const exist = await prisma.cmsArticleCategory.findFirst({
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
  const category = await prisma.cmsArticleCategory.update({
    where: {
      id
    },
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

  return api.success("更新成功！", category);
}

export async function deleteCategory(request: NextRequest, context: { params: Params }) {
  const id = Number(context.params.id);

  // 查询当前分类是否存在
  const category = await prisma.cmsArticleCategory.findFirst({
    where: {
      id,
      deletedAt: null
    }
  });

  if (!category) {
    return api.error("分类不存在！");
  }

  // 查询是否存在子集分类
  const children = await prisma.cmsArticleCategory.findFirst({
    where: {
      parentId: Number(id)
    }
  });

  if (children) {
    return api.error("存在子分类，清先删除子分类！");
  }

  const del = await prisma.cmsArticleCategory.update({
    where: {
      id: Number(id)
    },
    data: {
      deletedAt: new Date()
    }
  });
  return api.success("删除成功！", category);
}

module.exports = {
  GET: getCategory,
  PUT: updateCategory,
  DELETE: deleteCategory
};
