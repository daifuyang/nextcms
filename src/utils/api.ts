import { NextRequest, NextResponse } from "next/server";

export function apiHandler(handler: any) {
  return async (req: NextRequest, ...args: any) => {
    try {
      return await handler(req, ...args);
    } catch (err: any) {
      return error(err.message);
    }
  };
}

const json = {
  code: 1,
  msg: "",
  data: null
};

export function success(msg: string, data: any = null) {
  json.code = 1;
  json.msg = msg;
  json.data = data;
  return NextResponse.json(json);
}

export function error(msg: string, data: any = null) {
  json.code = 0;
  json.msg = msg;
  json.data = data;
  return NextResponse.json(json);
}
