/**
 * @author: daifuyang
 * @date: 2024-05-07
 * @description: 文章分类模型文件
 */

import prisma from "@/utils/prisma";
import redis from "@/utils/redis";
import { stringify } from "@/utils/util";
import { cmsArticleCategory } from "@prisma/client";

const categoryIdKey = "nextcms:article:category:id:";

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
export async function getCategoryCount() {
  // 先获取所有的文章数量
  const total = prisma.cmsArticleCategory.count({
    where: {
      deletedAt: 0
    }
  });
  return total;
}

// 获取分类树
export async function getCagegoryTree(params: CategoryTreeParams) {
  const categories = await prisma.cmsArticleCategory.findMany(params);

  let treeData: any = [];
  if (categories) {
    treeData = dataToTree(categories);
  }

  return treeData;
}

// 获取分类列表
export async function getCategoryList(params: categoryListParams) {
  const { current, pageSize } = params;
  const offset = (current - 1) * pageSize;
  const categories = await prisma.cmsArticleCategory.findMany({
    skip: offset,
    take: pageSize,
    where: {
      deletedAt: 0
    }
  });
}

// 获取单个分类
export async function getCategoryById(id: number) {
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
