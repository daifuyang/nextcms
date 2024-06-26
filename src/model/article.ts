/**
 * @author: daifuyang
 * @date: 2024-05-07
 * @description: 文章模型文件
 */

import prisma from "@/utils/prisma";
import { Prisma, PrismaClient, cmsArticle, cmsArticleCategory } from "@prisma/client";
import { getCategoryPostByArticleId, getCategoryPostsByArticleId } from "./articleCategoryPost";
import { getArticleCategoryById, getCategorysByPosts } from "./articleCategory";
import redis from "@/utils/redis";
import { modelDateTime, widthDateTime } from "./date";
import { ITXClientDenyList } from "@prisma/client/runtime/library";

interface ParamsProps {
  current: number;
  pageSize: number;
}

const articleIdKey = `nextcms:article:id:`;

// 获取全部文章数
export async function getArticleCount() {
  // 先获取所有的文章数量
  const total = await prisma.cmsArticle.count({
    where: {
      deletedAt: 0
    }
  });
  return total;
}

// 获取文章分页列表
export async function getList(params: ParamsProps) {
  const { current, pageSize } = params;
  // 获取所有文章，分页
  const offset = (current - 1) * pageSize;
  const articles = await prisma.cmsArticle.findMany({
    skip: offset,
    take: pageSize,
    where: {
      deletedAt: 0
    }
  });

  // 获取文章的分类

  type List = cmsArticle &
    modelDateTime & {
      category?: cmsArticleCategory;
    };

  const list: List[] = [...articles];

  for (let index = 0; index < articles.length; index++) {
    const item = articles[index];
    widthDateTime(list[index], item);

    if (list[index]?.keywords) {
      (list[index] as any).keywords = item.keywords?.split(",") || [];
    }
    const categoryPosts = await getCategoryPostsByArticleId(item.id);
    await getCategorysByPosts(list[index], categoryPosts);
  }

  return list;
}

// 根据文章id获取文章信息
export async function getArticleById(id: number) {
  const key = `${articleIdKey}${id}`;
  const cache = await redis.get(key);
  let article: cmsArticle | null = null;
  if (cache) {
    article = JSON.parse(cache);
  } else {
    article = await prisma.cmsArticle.findFirst({
      where: {
        id,
        deletedAt: 0
      }
    });

    if (article) {
      redis.set(key, JSON.stringify(article));
    }
  }

  return article;
}

// 创建一篇文章
export async function createArticle(
  data: Prisma.cmsArticleCreateInput,
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  const article = await tx.cmsArticle.create({
    data
  });
  return article;
}

// 更新一篇文章
export async function updateArticle(
  id: number,
  data: Prisma.cmsArticleUpdateInput,
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  const key = `${articleIdKey}${id}`;
  redis.del(key);

  const article = await tx.cmsArticle.update({
    where: {
      id
    },
    data
  });
  return article;
}
