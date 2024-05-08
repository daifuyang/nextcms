/**
 * @author: daifuyang
 * @date: 2024-05-07
 * @description: 文章分类关联模型文件
 */

import prisma from "@/utils/prisma";
import redis from "@/utils/redis";

interface CategoryPost {
  id: number;
  articleId: number;
  categoryId: number;
  order: number | null;
}

const articleIdKey = "nextcms:article_category_post:articleId:";

// 根据文章id获取分类管理
export async function getCategoryPostByArticleId(articleId: number) {
  const key = `${articleIdKey}${articleId}`;
  const cache = await redis.get(key);
  let categoryPost: CategoryPost | null = null;
  if (cache) {
    categoryPost = JSON.parse(cache);
  } else {
    categoryPost = await prisma.cmsArticleCategoryPost.findFirst({
      where: {
        articleId
      }
    });

    if (categoryPost) {
      redis.set(key, JSON.stringify(categoryPost));
    }
  }

  return categoryPost;
}
