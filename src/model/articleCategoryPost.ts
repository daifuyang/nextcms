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

// 根据文章id获取所有分类关系
export async function getCategoryPostsByArticleId(articleId: number) {
  const categoryPosts = await prisma.cmsArticleCategoryPost.findMany({
    where: {
      articleId
    }
  });
  return categoryPosts;
}

// 建立分类映射关系
export async function createArticleCategoryPost(
  articleId: number,
  categoryIds: number[],
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  const categoryPosts = await tx.cmsArticleCategoryPost.createMany({
    data: categoryIds.map((categoryId) => {
      return {
        articleId,
        categoryId
      };
    })
  });

  return categoryPosts;
}

// 更新文章和分类的关系
export async function updateArticleCategoryPost(
  articleId: number,
  categoryIds: number[],
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  // 查询之前的分类关系
  const oldCategoryPosts = await tx.cmsArticleCategoryPost.findMany({
    where: {
      articleId
    }
  });

  const set1 = new Set(categoryIds);
  const set2 = new Set(oldCategoryPosts?.map((item) => item.categoryId));

  // 找出需要删除的
  const deleteCategoryIds = Array.from(set2).filter((item) => !set1.has(item));

  // 找出需要新增的
  const createCategoryIds = Array.from(set1).filter((item) => !set2.has(item));

  return await prisma.$transaction(async (tx) => {
    await tx.cmsArticleCategoryPost.deleteMany({
      where: {
        articleId,
        categoryId: {
          in: deleteCategoryIds
        }
      }
    });

    await tx.cmsArticleCategoryPost.createMany({
      data: createCategoryIds.map((categoryId) => {
        return {
          articleId,
          categoryId
        };
      })
    });
  });
}

// 删除文章和分类的关系
export async function deleteArticleCategoryPost(
  articleId: number,
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  const categoryPost = await tx.cmsArticleCategoryPost.findFirst({
    where: {
      articleId
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
