import { NextRequest } from "next/server";
import api from "@/utils/response";
import {
  getResourceCategoryByName,
  getResourceCategoryCount,
  getResourceCategoryList,
  createResourceCategory
} from "@/model/resourceCategory";
import getCurrentUser from "@/utils/user";
import { now } from "@/utils/date";

export async function GET(request: NextRequest) {
  // 获取分页
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const total = await getResourceCategoryCount();
  const data = await getResourceCategoryList({ current, pageSize });

  return api.success("获取成功！", {
    total,
    current,
    pageSize,
    data
  });
}

// 新增分类
export async function POST(request: NextRequest) {
  // 获取请求参数
  const json = await request.json();
  const { name, description, parentId = 0 } = json;
  if (name == "") {
    return api.error("分类名称不能为空！");
  }
  // 判定当前分类是否存在
  const resourceCategory = await getResourceCategoryByName(name);
  if (resourceCategory) {
    return api.error("该分类已存在！");
  }

  const { userId, loginName } = getCurrentUser(request);

  // 存入到数据库
  const res = await createResourceCategory({
    name,
    description,
    parentId,
    createId: userId,
    creator: loginName,
    updateId: userId,
    updater: loginName,
    createdAt: now(),
    updatedAt: now(),
    deletedAt: 0
  });

  return api.success("创建成功!", res);
}
