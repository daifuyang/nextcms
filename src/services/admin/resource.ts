import { request } from "@/utils/request";

export async function getResourceList(params: any = {}) {
  return await request.get("/api/admin/resource", { params });
}

// 上传组件
export async function uploadFiles(data: any) {
    return await request.post("/api/admin/resource", data);
}