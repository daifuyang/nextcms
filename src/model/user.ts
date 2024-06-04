/**
 * @author: daifuyang
 * @date: 2024-05-08
 * @description: 用户模型文件
 */

import redis from "@/utils/redis";
import prisma from "../utils/prisma";
import { cmsUser, cmsUserToken } from "@prisma/client";
import dayjs from "dayjs";
import { now } from "@/utils/date";

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

// 统计所有用户数量
export async function getUserTotal(tx = prisma) {
  return tx.cmsUser.count();
}

// 获取用户列表
export async function getUserList(current: number, pageSize: number, tx = prisma) {
  const params: {
    skip?: number;
    take?: number;
  } = {};
  if (pageSize > 0) {
    params.skip = (current - 1) * pageSize;
    params.take = pageSize;
  }

  const user = await tx.cmsUser.findMany({
    ...params,
    orderBy: {
      id: "desc"
    }
  });

  return user;
}

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
      createdAt: now(),
      updatedAt: now()
    }
  });
  await prisma.$disconnect();
  return user;
}
