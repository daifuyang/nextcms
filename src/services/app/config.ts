import { request } from "@/utils/request";

export async function getConfig(key: string) {
    return await request.get(`/api/config/${key}`);
}