/**
 * @author: daifuyang
 * @date: 2024-05-11
 * @description: 页面路由文件
 */

import prisma from "@/utils/prisma";
import redis from "@/utils/redis";
import { isObjEqual, stringify } from "@/utils/util";
import { Prisma, PrismaClient, systemRoute } from "@prisma/client";
import { DefaultArgs, ITXClientDenyList } from "@prisma/client/runtime/library";

const routeFullUrlKey = "nextcms:route:fullUrl:";
const routeUrlKey = "nextcms:route:url:";

// 获取所有路由列表
export function getRoutes(
  params: Prisma.systemRouteFindManyArgs<DefaultArgs>,
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  return tx.systemRoute.findMany(params);
}

// 根据fullUrl获取单个路由
export async function getRouteByFullUrl(
  fullUrl: string,
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  const key = `${routeFullUrlKey}${fullUrl}`;
  let route: systemRoute | null = null;
  const cacahe = await redis.get(key);
  if (cacahe) {
    route = JSON.parse(cacahe);
  } else {
    route = await tx.systemRoute.findFirst({
      where: {
        fullUrl
      }
    });
    if (route) {
      redis.set(key, stringify(route));
    }
  }
  return route;
}

// 根据url获取单个路由
export async function getRouteByUrl(
  url: string,
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  const key = `${routeUrlKey}${url}`;
  let route: systemRoute | null = null;
  const cacahe = await redis.get(key);
  if (cacahe) {
    route = JSON.parse(cacahe);
  } else {
    route = await tx.systemRoute.findFirst({
      where: {
        url
      }
    });
    if (route) {
      redis.set(key, stringify(route));
    }
  }
  return route;
}

// 保存单个路由
export async function saveRoute(
  data: Prisma.systemRouteUncheckedCreateInput,
  tx: Omit<PrismaClient, ITXClientDenyList> = prisma
) {
  // 查询url是否已存在
  const exist = await getRouteByUrl(data.url, tx);
  if (exist) {
    const newObj = { ...data };
    delete newObj.id;
    await redis.del(`${routeUrlKey}${data.url}`);
    return tx.systemRoute.update({
      where: {
        id: exist.id
      },
      data
    });
  } else {
    return tx.systemRoute.create({
      data
    });
  }
}
