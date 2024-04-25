import { request } from "@/utils/request";

export async function getPage(id: number| string) {
  return await request.get(`/api/page/${id}`);
}
