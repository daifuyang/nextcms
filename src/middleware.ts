import api from "@/utils/response";
import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 排除路径
const excludePaths = ["/api/admin/user/login"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("next-url", pathname);
  if (pathname.startsWith("/api/admin") && !excludePaths.includes(pathname)) {
    // 获取token
    const authorization = requestHeaders.get("authorization") || "";
    if (!authorization) {
      return api.errorWithCode(-1, "用户身份已失效！");
    }

    // 验证token
    const response = await fetch(`${origin}/api/currentUser`, {
      headers: {
        authorization
      }
    });

    const res = await response.json();

    if(res.code !== 1) {
      return api.errorWithCode(-1, "用户身份已失效！");
    }
    
    const {data} = res
    requestHeaders.set("userId", data.id);
    requestHeaders.set("loginName", data.loginName);
  }

  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders
    }
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)"
  ]
};
