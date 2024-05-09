/**
 * @author: daifuyang
 * @date: 2024-05-07
 * @description: 文章分类关联模型文件
 */

import prisma from "@/utils/prisma";
import redis from "@/utils/redis";
import { PrismaClient } from "@prisma/client";
import { ITXClientDenyList } from "@prisma/client/runtime/library";

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

// 更新文章和分类的关系
export async function updateArticleCategoryPost(
  articleId: number,
  categoryId: number,
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  // 查询之前的分类关系
  const oldCategoryPost = await tx.cmsArticleCategoryPost.findFirst({
    where: {
      articleId
    }
  });

  let categoryPost: CategoryPost | null = null;
  if (oldCategoryPost) {
    // 更新为新的分类
    categoryPost = await prisma.cmsArticleCategoryPost.update({
      where: {
        id: oldCategoryPost.id
      },
      data: {
        categoryId
      }
    });
  } else {
    // 新增
    categoryPost = await prisma.cmsArticleCategoryPost.create({
      data: {
        articleId,
        categoryId
      }
    });
  }

  return categoryPost;
}

// 删除文章和分类的关系
export async function deleteArticleCategoryPost(
  articleId: number,
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  const categoryPost = await tx.cmsArticleCategoryPost.findFirst({
    where: {
      articleId,
    }
  });

  if (categoryPost) {
    await tx.cmsArticleCategoryPost.delete({
      where: {
        id: categoryPost.id
      }
    });
  }
}
