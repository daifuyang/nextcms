import prisma from "@/utils/prisma";
import api from "@/utils/response";
import { time } from "console";
import { NextRequest } from "next/server";

type Params = {
  id: string;
};

export async function deleteCategories(request: NextRequest, context: { params: Params }) {
  const id = context.params.id;

  // 查询当前分类是否存在
  const category = await prisma.cmsArticleCategory.findFirst({
    where: {
      id: Number(id),
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

  console.log('del',del)

  return api.success("删除成功！", category);
}
module.exports = {
  DELETE: deleteCategories
};
