/**
 * @author: daifuyang
 * @date: 2024-05-07
 * @description: 文章模型文件
 */

import prisma from "@/utils/prisma";
import { cmsArticle, cmsArticleCategory } from "@prisma/client";
import { getCategoryPostByArticleId } from "./articleCategoryPost";
import { getCategoryById } from "./articleCategory";
import redis from "@/utils/redis";
import dayjs from "dayjs";
import { modelDateTime, widthDateTime } from "./date";

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

    const categoryPost = await getCategoryPostByArticleId(item.id);
    const { categoryId } = categoryPost || {};
    if (categoryId) {
      const category = await getCategoryById(categoryId);
      if (category) {
        list[index].category = category;
      }
    }
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
        id
      }
    });

    if (article) {
      redis.set(key, JSON.stringify(article));
    }
  }
  return article;
}
