import { getPage } from "@/model/page";
import { error, success } from "@/utils/api";
import prisma from "@/utils/prisma";
import { assignSchema, getFileSchema } from "@/utils/util";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const idNumber = Number(id);
  if (idNumber <= 0 || Number.isNaN(idNumber)) {
    return error("该页面不存在或参数错误！");
  }

  // 获取公共头和公共页脚
  const header: any = await getPage({
    where: {
      type: "header"
    }
  });

  const headerSchema = getFileSchema(header?.filePath);

  const footer: any = await getPage({
    where: {
      type: "footer"
    }
  });

  const footerSchema = getFileSchema(footer?.filePath);
  const page: any = await getPage({
    where: {
      id: Number(id)
    }
  });

  if (!page) {
    return error("该页面不存在！");
  }

  // 读取本地schema文件
  const filePath = page?.filePath;
  let schema = getFileSchema(filePath);
  assignSchema(schema, headerSchema, "start");
  assignSchema(schema, footerSchema);

  if (schema) {
    page.schema = schema;
  }
  return success("获取成功！", page);
}
