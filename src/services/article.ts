import { request } from "@/utils/request";

export async function list(params: any) {
  const res = await request.get("/api/admin/article", {params});
  return res;
}
