import { NextRequest } from "next/server";

// 获取用户信息
const getCurrentUser = (request: NextRequest) => {
  const userId = request.headers.get("userId") || '';
  const loginName = request.headers.get("loginName") || '';

  let id = 0
  if(userId) {
    id = Number(userId)
  }

  return {
    userId: id,
    loginName
  };
};
export default getCurrentUser;
