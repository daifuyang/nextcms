import { request } from "@/utils/request";

export function articleCategories(params: any) {
  return request.get("/api/admin/article/categories", { params });
}

export function addArticleCategories(data: any) {
  return request.post("/api/admin/article/categories", { data });
}
