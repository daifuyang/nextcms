import { request } from "@/utils/request";

export function getCurrentUser() {
  return request.get("/api/currentUser");
}

export function login(data: any) {
  return request.post("/api/admin/user/login", data);
}
