import api from "@/utils/response";
import { NextRequest } from "next/server";
import redis from "@/utils/redis";
import prisma from "@/utils/prisma";
import { getArticleById } from "@/model/article";
import { getCategoryById } from "@/model/articleCategory";

// 查看单条数据
interface Params {
  id: string;
}

export async function GET(request: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  const article = await getArticleById(Number(id));

  // 根据id获取所关联的分类id
  const categoryPost = await prisma.cmsArticleCategoryPost.findFirst({
    where: {
      articleId: Number(id)
    }
  });

  const data: any = { ...article };

  if (categoryPost) {
    const { categoryId } = categoryPost;
    const category = await getCategoryById(categoryId)
    data.category = category;
  }

  return api.success("获取成功！", data);
}
