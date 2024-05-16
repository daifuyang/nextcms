import { NextRequest } from "next/server";
import api from "@/utils/response";
import { getResourceCount, getResourceList } from "@/model/resource";

export async function GET(request: NextRequest) {
  // 获取分页
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const total = await getResourceCount();
  const data = await getResourceList({ current, pageSize });

  return api.success("获取成功！", {
    total,
    current,
    pageSize,
    data
  });

}
