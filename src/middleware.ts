import { error, success } from "@/utils/api";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("next-url", pathname);
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders
    }
  });
  return response;
}
