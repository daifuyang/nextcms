/**
 * @author: daifuyang
 * @date: 2024-05-07
 * @description: 页面模型文件
 */

import prisma from "@/utils/prisma";
import redis from "@/utils/redis";
import api from "@/utils/response";
import { getFileSchema } from "@/utils/util";
import { cmsPage } from "@prisma/client";

interface PageListParams {
  current: number;
  pageSize: number;
}

type Pagination = {
  data: cmsPage[];
  current: number;
  pageSize: number;
  total: number;
};

interface PageParams {
  where: {
    [key: string]: any;
  };
}

// 根据条件获取分页列表
export async function getPageList(params: PageListParams): Promise<cmsPage[] | Pagination> {
  const { current, pageSize } = params;

  // 无分页
  if (pageSize == 0) {
    const list = await prisma.cmsPage.findMany({
      where: {
        NOT: [{ type: "footer" }, { type: "header" }]
      },
      orderBy: {
        id: "asc"
      }
    });
    return list;
  }

  // 有分页
  const total = await prisma.cmsPage.count();
  const list = await prisma.cmsPage.findMany({
    take: pageSize,
    skip: pageSize * (current - 1),
    orderBy: {
      id: "desc"
    }
  });

  const pagination: Pagination = {
    data: list,
    current,
    pageSize,
    total
  };

  return pagination;
}

// 根据条件获取页面
export async function getPage(params: PageParams) {
  const page: any = await prisma.cmsPage.findFirst(params);
  return page;
}

// 根据type获取页面
export async function getPageByType(type: string) {
  const key = `nextcms:page:type:${type}`;
  const cache = await redis.get(key);
  let page: cmsPage | null = null;
  if (cache) {
    page = JSON.parse(cache);
  } else {
    page = await prisma.cmsPage.findFirst({
      where: {
        type
      }
    });
    if (page) {
      redis.set(key, JSON.stringify(page));
    }
  }
  return page;
}

// 根据id获取页面
export async function getPageById(id: number) {
  const key = `nextcms:page:id:${id}`;
  const cache = await redis.get(key);
  let page: cmsPage | null = null;
  if (cache) {
    page = JSON.parse(cache);
  } else {
    page = await prisma.cmsPage.findFirst({
      where: {
        id
      }
    });
    if (page) {
      redis.set(key, JSON.stringify(page));
    }
  }
  return page;
}

// 获取本地schema文件
export async function getPageSchema(filePath: string) {
  const key = `nextcms:file:${filePath}`;
  let pageSchema: any = null;
  const cache = await redis.get(key);
  if (cache) {
    pageSchema = JSON.parse(cache);
  } else {
    pageSchema = getFileSchema(filePath);
    if (pageSchema) {
      redis.set(key, JSON.stringify(pageSchema));
    }
  }
  return pageSchema
}
