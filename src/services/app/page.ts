import { request } from "@/utils/request";

export async function getPage(id: number) {
  return await request.get(`/api/page/${id}`);
}
