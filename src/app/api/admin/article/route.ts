import { type NextRequest, NextResponse } from "next/server";
import api from "@/utils/response";
import prisma from "@/utils/prisma";
import getCurrentUser from "@/utils/user";
import { escapeHTML } from "@/utils/util";
import { createArticle, getArticleCount, getList } from "@/model/article";
import { now } from "@/utils/date";
import { getArticleCategoryById } from "@/model/articleCategory";
import { createArticleCategoryPost } from "@/model/articleCategoryPost";

// 获取文章列表
async function articleList(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const total = await getArticleCount();
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
  const { categoryIds, title, content, excerpt, publishedAt } = params;
  const { userId, loginName } = getCurrentUser(request);

  let { keywords } = params;

  if (keywords instanceof Array) {
    keywords = keywords?.join(",");
  }

  // 验证必填参数不能为空
  if (categoryIds?.length <= 0) {
    return api.error("分类不能为空！");
  }

  if (!title) {
    return api.error("文章标题不能为空！");
  }

  // 判断分类是否存在
  for (let index = 0; index < categoryIds.length; index++) {
    const cid = categoryIds[index];
    const category = await getArticleCategoryById(cid);
    if (!category) {
      return api.error("分类不存在！");
    }
  }

  // 入库
  const article = await prisma.$transaction(async (tx) => {
    const article = await createArticle(
      {
        title,
        content: escapeHTML(content),
        keywords: keywords?.join(","),
        excerpt,
        publishedAt,
        createId: userId,
        creator: loginName,
        updateId: userId,
        updater: loginName,
        createdAt: now(),
        updatedAt: now()
      },
      tx
    );

    // 建立分类映射关系
    await createArticleCategoryPost(article.id, categoryIds, tx);

    return article;
  });

  return api.success("添加成功！", article);
}

module.exports = {
  GET: articleList,
  POST: addArticle
};
