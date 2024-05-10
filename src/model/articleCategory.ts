/**
 * @author: daifuyang
 * @date: 2024-05-07
 * @description: 文章分类模型文件
 */

import prisma from "@/utils/prisma";
import redis from "@/utils/redis";
import { stringify } from "@/utils/util";
import { Prisma, cmsArticleCategory } from "@prisma/client";

const categoryIdKey = "nextcms:article:category:id:";
const categoryTreeKey = "nextcms:article:category:tree";

interface CategoryTreeParams {
  where: {
    [key: string]: any;
  };
}

interface categoryListParams {
  current: number;
  pageSize: number;
}

type TreeNode = cmsArticleCategory & {
  children?: cmsArticleCategory[];
};

function dataToTree(data: TreeNode[]): TreeNode[] {
  const map: { [key: number]: TreeNode } = {};
  const tree: TreeNode[] = [];

  data.forEach((node) => {
    map[node.id] = { ...node };
  });

  data.forEach((node) => {
    if (node.parentId !== 0) {
      const parent = map[node.parentId];
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(map[node.id]);
      }
    } else {
      tree.push(map[node.id]);
    }
  });

  return tree;
}

// 获取分类总数
export async function getArticleCategoryCount() {
  // 先获取所有的文章数量
  const total = prisma.cmsArticleCategory.count({
    where: {
      deletedAt: 0
    }
  });
  return total;
}

// 获取分类树
export async function getArticleCagegoryTree(params: CategoryTreeParams) {
  // 如果没用name和status，则优先查缓存
  let canDo = false;
  const { name, status } = params?.where || {};
  if (!name && !status) {
    canDo = true;
  }

  if (canDo) {
    const cache = await redis.get(categoryTreeKey);
    if (cache) {
      return JSON.parse(cache);
    }
  }

  const categories = await prisma.cmsArticleCategory.findMany(params);

  let treeData: any = [];
  if (categories) {
    treeData = dataToTree(categories);
    if (canDo && treeData?.length > 0) {
      redis.set(categoryTreeKey, stringify(treeData));
    }
  }

  return treeData;
}

// 获取分类列表
export async function getArticleCategoryList(params: categoryListParams) {
  const { current, pageSize } = params;
  const offset = (current - 1) * pageSize;
  const categories = await prisma.cmsArticleCategory.findMany({
    skip: offset,
    take: pageSize,
    where: {
      deletedAt: 0
    }
  });
  return categories;
}

// 获取单个分类
export async function getArticleCategoryById(id: number) {
  const key = `${categoryIdKey}${id}`;
  const cache = await redis.get(key);
  let category: cmsArticleCategory | null = null;

  if (cache) {
    category = JSON.parse(cache);
  } else {
    // 获取单个分类
    category = await prisma.cmsArticleCategory.findFirst({
      where: {
        id,
        deletedAt: 0
      }
    });

    if (category) {
      redis.set(key, stringify(category));
    }
  }

  return category;
}

// 根据条件获取单个分类

interface categoryParams {
  where: Prisma.cmsArticleCategoryWhereInput;
}

export async function getArticleCategory(params: categoryParams) {
  const { where } = params;
  const category = await prisma.cmsArticleCategory.findFirst({
    where
  });
  return category;
}

// 新增单个分类
export async function createArticleCategory(data: Prisma.cmsArticleCategoryCreateInput) {
  redis.del(categoryTreeKey);
  const category = await prisma.cmsArticleCategory.create({
    data
  });
  return category;
}

// 更新单个分类
export async function updateArticleCategory(
  id: number,
  data: Prisma.cmsArticleCategoryUpdateInput
) {
  const key = `${categoryIdKey}${id}`;
  redis.del(key);
  redis.del(categoryTreeKey);
  const category = await prisma.cmsArticleCategory.update({
    where: {
      id
    },
    data
  });
  return category;
}

// 根据分类关系获取分类详细信息
export async function getCategorysByPosts(target: any, categoryPosts: any[]) {

  if(!target.category) {
    target.category = []
  }
  
  for (let index = 0; index < categoryPosts.length; index++) {
    const post = categoryPosts[index];
    const { categoryId } = post;
    const category = await getArticleCategoryById(categoryId);
    target.category.push(category);
  }
}
