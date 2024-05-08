import { type NextRequest } from "next/server";
import api from "@/utils/response";
import { currentUser } from "@/model/user";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return api.error("用户不存在！");
  }

  const user = await currentUser({
    accessToken
  });

  if(user) {
    return api.success("获取成功！",user)
  }

  return api.error("用户不存在！")

}
