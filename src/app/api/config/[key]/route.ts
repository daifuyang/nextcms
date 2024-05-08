import { getConfigByKey } from "@/model/config";
import { error, success } from "@/utils/api";
import prisma from "@/utils/prisma";

// 获取一个配置
export async function GET(request: Request, { params }: { params: { key: string } }) {
    const { key } = params;
    const config = await getConfigByKey(key)
    return success("获取成功！",config)
    
}