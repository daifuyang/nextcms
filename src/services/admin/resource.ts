import { request } from "@/utils/request";

export async function getResourceList(params: any = {}) {
  return await request.get("/api/admin/resource", { params });
}

// 上传组件
export async function uploadFiles(data: any) {
    return await request.post("/api/admin/resource", data);
}

export async function getResourceCategory(params: any = {}) {
  return await request.get("/api/admin/resource/category", { params });
}

// 删除一条
export async function deleteResource(id: string| number ,params: any = {}) {
  return await request.delete(`/api/admin/resource/${id}`, { params });
}
