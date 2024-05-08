/**
 * @author: daifuyang
 * @date: 2024-05-07
 * @description: 配置文件模型文件
 */

import prisma from "@/utils/prisma";
import redis from "@/utils/redis";
import { systemConfig } from "@prisma/client";

export async function getConfigByKey(key: string) {
  const redisKey = `nextcms:config:key:${key}`;
  const cache = await redis.get(redisKey);
  let config: systemConfig | null = null;
  if (cache) {
    config = JSON.parse(cache);
  } else {
    config = await prisma.systemConfig.findFirst({
      where: {
        key
      }
    });
    if (config) {
      // 存入redis
      redis.set(redisKey, JSON.stringify(config));
    }
  }
  return config;
}
