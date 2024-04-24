import { request } from "@/utils/request";

// 树列表
export function getArticleCategoriesTree(params: any = {}) {
  return request.get("/api/admin/article/categories/tree", { params });
}

// 新增分类
export function addArticleCategory(data: any) {
  return request.post("/api/admin/article/categories", data);
}

// 查看单个分类
export function getArticleCategory(id: string) {
  return request.get(`/api/admin/article/categories/${id}`);
}

// 更新分类
export function updateArticleCategory(id: string, data: any) {
  return request.put(`/api/admin/article/categories/${id}`, data);
}
 
// 删除分类
export function deleteCategory(id: string) {
  return request.delete(`/api/admin/article/categories/${id}`)
}
