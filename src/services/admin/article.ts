import { request } from "@/utils/request";

export async function getArticles(params: any) {
  return await request.get("/api/admin/article", { params });
}

// 添加文章
export async function addArticle(data: any) {
  return await request.post("/api/admin/article", data);
}

// 获取单个文章
export async function getArticle(id: string | number) {
  return await request.get(`/api/admin/article/${id}`);
}

// 更新文章
export async function updateArticle(id: string | number, data: any) {
  return await request.put(`/api/admin/article/${id}`, data);
}

// 删除文章
export async function deleteArticle(id: string | number) {
  return await request.delete(`/api/admin/article/${id}`);
}
