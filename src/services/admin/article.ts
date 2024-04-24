import { request } from "@/utils/request";

export async function getArticles(params: any) {
  return await request.get("/api/admin/article", { params });
}

// 添加文章
export async function addArticle(data: any) {
  return await request.post("/api/admin/article", data);
}
