/**
 * @author: daifuyang
 * @date: 2024-05-16
 * @description: 素材模型文件
 */

import prisma from "@/utils/prisma";

// 获取资源总数
export async function getResourceCount() {
    return await prisma.cmsResource.count({
        where: {
            deletedAt: 0
        }
    })
}

// 获取资源列表

interface resourceListParams {
    current: number;
    pageSize: number;
  }
  

export async function getResourceList(params: resourceListParams) {
    const { current, pageSize } = params;
    const offset = (current - 1) * pageSize;
    const resource = await prisma.cmsResource.findMany({
      skip: offset,
      take: pageSize,
      where: {
        deletedAt: 0
      }
    });
    return resource;
  }