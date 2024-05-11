import { request } from "@/utils/request";

export async function getArticle(id: number| string) {
  return await request.get(`/api/article/${id}`);
}
