import { request } from "@/utils/request";

export function articleCategoriesTree(params: any = {}) {
  return request.get("/api/admin/article/categories/tree", { params });
}

export function addArticleCategories(data: any) {
  return request.post("/api/admin/article/categories", data);
}
