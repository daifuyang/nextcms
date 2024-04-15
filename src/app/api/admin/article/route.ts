import { type NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/utils/api";
import api from "@/utils/response";
import prisma from "@/utils/prisma";
import getCurrentUser from "@/utils/user";
import { escapeHTML } from "@/utils/util";

export async function articleList(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  // 先获取所有的文章数量
  const total = await prisma.cmsArticle.count({
    where: {
      deletedAt: null
    }
  });

  // 获取所有文章，分页
  const offset = (current - 1) * pageSize;
  const articles = await prisma.cmsArticle.findMany({
    skip: offset,
    take: pageSize,
    where: {
      deletedAt: null
    }
  });

  // 获取文章的分类

  const ids = articles.map((item) => item.id);

  const categoryPosts = await prisma.cmsArticleCategoryPost.findMany({
    where: {
      articleId: {
        in: ids
      }
    }
  });

  const categoryIds: any = [];
  categoryPosts.forEach((item) => {
    if (!categoryIds.includes(item.categoryId)) {
      categoryIds.push(item.categoryId);
    }
  });

  // 查询所有得分类
  const categories = await prisma.cmsArticleCategory.findMany({
    where: {
      id: {
        in: categoryIds
      },
      deletedAt: null
    }
  });

  // 合并所有得关系
  const data = articles.map((item: any) => {
    const categoryPost = categoryPosts.filter((post) => post.articleId === item.id);

    if (categoryPost) {
      // 获取分类
      const categpry = categoryPost.map((post) => {
        return categories.find((item) => item.id === post.categoryId);
      });
      item.category = categpry;
    }
    return item;
  });

  return api.success("获取成功！", {
    total,
    current,
    pageSize,
    data
  });
}

// 新增
export async function addArticle(request: NextRequest) {
  const params: any = await request.json();

  const { categoryId, title, content, keywords, excerpt, publishedTime } = params;

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
      deletedAt: null
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
      publishedTime,
      createId: userId,
      creator: loginName,
      updateId: userId,
      updater: loginName
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
  POST: apiHandler(addArticle)
};
