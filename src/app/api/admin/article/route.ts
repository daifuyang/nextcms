import { type NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/utils/api";
import api from "@/utils/response";
import prisma from "@/utils/prisma";
import getCurrentUser from "@/utils/user";
import { escapeHTML } from "@/utils/util";
import redis from "@/utils/redis";
import { getArticleCount, getList } from "@/model/article";
import { timestamp } from "@/utils/date";

async function articleList(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const total = await getArticleCount()
  const data = await getList({ current, pageSize });

  return api.success("获取成功！", {
    total,
    current,
    pageSize,
    data
  });
}

// 新增
async function addArticle(request: NextRequest) {
  const params: any = await request.json();
  const { categoryId, title, content, keywords, excerpt, publishedAt } = params;
  const { userId, loginName } = getCurrentUser(request);
  // 验证必填参数不能为空
  if (!categoryId) {
    return api.error("分类不能为空！");
  }

  if (!title) {
    return api.error("文章标题不能为空！");
  }

  // 判断分类是否存在
  const category = await prisma.cmsArticleCategory.findFirst({
    where: {
      id: categoryId,
      deletedAt: 0
    }
  });

  if (!category) {
    return api.error("分类不存在！");
  }

  // 入库
  const article = await prisma.cmsArticle.create({
    data: {
      title,
      content: escapeHTML(content),
      keywords: keywords?.join(","),
      excerpt,
      publishedAt,
      createId: userId,
      creator: loginName,
      updateId: userId,
      updater: loginName,
      createdAt: timestamp(),
      updatedAt: timestamp()
    }
  });

  // 建立分类映射关系
  await prisma.cmsArticleCategoryPost.create({
    data: {
      articleId: article.id,
      categoryId
    }
  });

  return api.success("添加成功！", article);
}

module.exports = {
  GET: articleList,
  POST: addArticle
};
