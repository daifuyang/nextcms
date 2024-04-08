import { request } from "@/utils/request";

// 树列表
export function articleCategoriesTree(params: any = {}) {
  return request.get("/api/admin/article/categories/tree", { params });
}

// 新增分类
export function addArticleCategories(data: any) {
  return request.post("/api/admin/article/categories", data);
}

// 删除分类
export function deleteCategories(id: string) {
  return request.delete(`/api/admin/article/categories/${id}`)
}
