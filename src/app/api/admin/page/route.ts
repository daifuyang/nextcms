import { type NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client'

export async function GET(request: NextRequest) {
  return new NextResponse(
    JSON.stringify({
      hello: "page api"
    })
  );
}

// 新增
export async function POST(request: NextRequest) {
  return NextResponse.json({ success: "hello" });
}
