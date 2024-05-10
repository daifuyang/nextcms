import api from "@/utils/response";
import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import { getArticleById, updateArticle } from "@/model/article";
import { getArticleCategoryById, getCategorysByPosts } from "@/model/articleCategory";
import getCurrentUser from "@/utils/user";
import { escapeHTML } from "@/utils/util";
import { now } from "@/utils/date";
import {
  deleteArticleCategoryPost,
  getCategoryPostsByArticleId,
  updateArticleCategoryPost
} from "@/model/articleCategoryPost";

// 查看单条数据
interface Params {
  id: string;
}

// 获取单个文章
export async function GET(request: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  const article = await getArticleById(Number(id));
  if (!article) {
    return api.error("文章不存在！");
  }

  // 根据id获取所关联的分类id
  const categoryPosts = await getCategoryPostsByArticleId(Number(id));
  const data: any = { ...article, category: [] };
  if (categoryPosts) {
    await getCategorysByPosts(data, categoryPosts)
  }

  data.keywords = data.keywords?.split(',')
  return api.success("获取成功！", data);
}

// 更新文章
export async function PUT(request: NextRequest, context: { params: Params }) {
  const params: any = await request.json();
  const { id, categoryIds, title, content, excerpt, publishedAt } = params;
  let {keywords} = params

  if(keywords instanceof Array) {
    keywords = keywords?.join(',')
  }

  const exist = await getArticleById(Number(id));

  if (!exist) {
    return api.error("文章不存在！");
  }

  const { userId, loginName } = getCurrentUser(request);
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

  const article = await prisma.$transaction(async (tx) => {
    // 入库
    const article = await updateArticle(
      id,
      {
        title,
        content: escapeHTML(content),
        keywords,
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

    if (article) {
      await updateArticleCategoryPost(id, categoryIds, tx);
    }

    return article;
  });

  return api.success("更新成功！", article);
}

// 删除文章
export async function DELETE(request: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  const exist = await getArticleById(Number(id));

  if (!exist) {
    return api.error("文章不存在！");
  }

  const article = await prisma.$transaction(async (tx) => {
    const article = await updateArticle(
      Number(id),
      {
        deletedAt: now()
      },
      tx
    );
    if (article) {
      await deleteArticleCategoryPost(article.id, tx);
    }
    return article;
  });

  return api.success("删除成功！", article);
}
