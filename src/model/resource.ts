/**
 * @author: daifuyang
 * @date: 2024-05-16
 * @description: 素材模型文件
 */
import prisma from "@/utils/prisma";
import { getConfigByKey } from "./config";
import { now } from "@/utils/date";

// 获取资源总数
export async function getResourceCount(params: { type?: string } = {}) {
  return await prisma.cmsResource.count({
    where: {
      fileType: params.type,
      deletedAt: 0
    }
  });
}

// 获取资源列表

interface resourceListParams {
  current: number;
  pageSize: number;
  type: string;
}

export async function getResourceList(params: resourceListParams) {
  const { current, pageSize, type } = params;
  const offset = (current - 1) * pageSize;
  const resource = await prisma.cmsResource.findMany({
    skip: offset,
    take: pageSize,
    where: {
      fileType: type,
      deletedAt: 0
    },
    orderBy: {
      id: "desc"
    }
  });

  // 追加prevPath

  const origin = (await getConfigByKey("cdn")) || "/";

  resource.forEach((item) => {
    (item as any).prevPath = `${origin}${item.filePath}`;
  });

  return resource;
}

// 获取当个资源
export async function getResourceById(id: number, tx = prisma) {
    return await tx.cmsResource.findFirst({
      where: {
        id,
        deletedAt: 0
      }
    })
}

// 逻辑删除
export async function deleteResourceById(id: number, tx = prisma) {
  return await tx.cmsResource.update({
    where: {
      id
    },
    data: {
      deletedAt: now()
    }
  })
}