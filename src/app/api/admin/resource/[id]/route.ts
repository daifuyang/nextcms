// 删除一条资源

import { deleteResourceById, getResourceById } from "@/model/resource";
import api from "@/utils/response";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return api.error("id不能为空！");
  }
  // 判断当前资源是否存在
  const resource = await getResourceById(Number(id));
  if(resource) {
    const del = await deleteResourceById(Number(id))
    if(del) {
        return api.success("删除成功！",del);
    }
  }
  return api.error("删除失败！");
}
