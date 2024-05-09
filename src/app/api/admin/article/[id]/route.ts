import api from "@/utils/response";
import { NextRequest } from "next/server";
import prisma from "@/utils/prisma";
import { getArticleById, updateArticle } from "@/model/article";
import { getArticleCategoryById } from "@/model/articleCategory";
import getCurrentUser from "@/utils/user";
import { escapeHTML } from "@/utils/util";
import { now } from "@/utils/date";
import { deleteArticleCategoryPost, updateArticleCategoryPost } from "@/model/articleCategoryPost";

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
  const categoryPost = await prisma.cmsArticleCategoryPost.findFirst({
    where: {
      articleId: Number(id)
    }
  });
  const data: any = { ...article };
  if (categoryPost) {
    const { categoryId } = categoryPost;
    const category = await getArticleCategoryById(categoryId);
    data.category = category;
  }
  return api.success("获取成功！", data);
}

// 更新文章
export async function PUT(request: NextRequest, context: { params: Params }) {
  const params: any = await request.json();
  const { id, categoryId, title, content, keywords, excerpt, publishedAt } = params;

  const exist = await getArticleById(Number(id));

  if (!exist) {
    return api.error("文章不存在！");
  }

  const { userId, loginName } = getCurrentUser(request);
  // 验证必填参数不能为空
  if (!categoryId) {
    return api.error("分类不能为空！");
  }

  if (!title) {
    return api.error("文章标题不能为空！");
  }

  // 判断分类是否存在
  const category = await getArticleCategoryById(categoryId);

  if (!category) {
    return api.error("分类不存在！");
  }

  const article = prisma.$transaction(async (tx) => {
    // 入库
    const article = await updateArticle(
      id,
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

    if (article) {
      await updateArticleCategoryPost(id, categoryId, tx);
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

  const article = prisma.$transaction(async (tx) => {
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
