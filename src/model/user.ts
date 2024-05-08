/**
 * @author: daifuyang
 * @date: 2024-05-08
 * @description: 用户模型文件
 */

import redis from "@/utils/redis";
import prisma from "../utils/prisma";
import { cmsUser, cmsUserToken } from "@prisma/client";
import api from "@/utils/response";
import dayjs from "dayjs";
import { timestamp } from "@/utils/date";

export interface ICreateUserParams {
  loginName: string;
  createId: number;
  creator: string;
  updateId: number;
  updater: string;
}

interface CurrentUserParams {
  accessToken: string;
}

const userIdKey = "nextcms:user:id:";

// 获取当前用户信息
export async function currentUser(params: CurrentUserParams) {
  const key = `nextcms:user:token:`;
  const { accessToken } = params;
  const cache = await redis.get(key);
  let usereToken: cmsUserToken | null = null;
  if (cache) {
    usereToken = JSON.parse(cache);
  }
  if (!usereToken) {
    // 验证token
    usereToken = await prisma.cmsUserToken.findFirst({
      where: {
        accessToken,
        expiryAt: {
          gt: dayjs().unix() // 没有失效
        }
      }
    });
  }
  if (usereToken?.userId) {
    const user = await getUserById(usereToken.userId);
    return user;
  }
  return null;
}

// 根据主键获取用户信息
export async function getUserById(id: number) {
  const key = `${userIdKey}${id}`;
  const cacahe = await redis.get(key);
  let user: cmsUser | null = null;
  if (cacahe) {
    user = JSON.parse(cacahe);
  } else {
    user = await prisma.cmsUser.findFirst({
      where: {
        id
      }
    });
    if (user) {
      redis.set(key, JSON.stringify(user));
    }
  }
  return user;
}

export async function createUser(params: ICreateUserParams) {
  const user = await prisma.cmsUser.create({
    data: {
      loginName: params.loginName,
      createId: params.createId,
      creator: params.creator,
      updateId: params.updateId,
      updater: params.updater,
      createdAt: timestamp(),
      updatedAt: timestamp()
    }
  });
  await prisma.$disconnect();
  return user;
}
