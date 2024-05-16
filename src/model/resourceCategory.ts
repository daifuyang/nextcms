/**
 * @author: daifuyang
 * @date: 2024-05-16
 * @description: 素材模型文件
 */

import prisma from "@/utils/prisma";
import redis from "@/utils/redis";
import { Prisma, cmsResource, cmsResourceCategory } from "@prisma/client";
const resourceCategoryNameKey = "nextcms:resource:category:name:";

// 获取资源总数
export async function getResourceCategoryCount() {
  return await prisma.cmsResourceCategory.count({
    where: {
      deletedAt: 0
    }
  });
}

// 获取资源列表

interface resourceListParams {
  current: number;
  pageSize: number;
}

export async function getResourceCategoryList(params: resourceListParams) {
  const { current, pageSize } = params;
  const offset = (current - 1) * pageSize;
  const resource = await prisma.cmsResourceCategory.findMany({
    skip: offset,
    take: pageSize,
    where: {
      deletedAt: 0
    }
  });
  return resource;
}

// 根据唯一键获取资源分类
export async function getResourceCategoryByName(name: string) {
  const key = `${resourceCategoryNameKey}${name}`;
  const cache = await redis.get(key);
  let resource: cmsResourceCategory | null = null;
  if (cache) {
    resource = JSON.parse(cache);
  } else {
    resource = await prisma.cmsResourceCategory.findFirst({
      where: {
        name,
        deletedAt: 0
      }
    });
    if (resource) {
      redis.set(key, JSON.stringify(resource));
    }
  }
  return resource;
}

// 保存分类
export async function createResourceCategory(resource: Prisma.cmsResourceCategoryCreateInput) {
  return await prisma.cmsResourceCategory.create({
    data: resource
  });
}
