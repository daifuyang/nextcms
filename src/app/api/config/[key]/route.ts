import { error, success } from "@/utils/api";
import prisma from "@/utils/prisma";

// 获取一个配置
export async function GET(request: Request, { params }: { params: { key: string } }) {
    const { key } = params;
    
    const config = await prisma.systemConfig.findFirst({
        where: {
            key
        }
    })

    return success("获取成功！",config)
    
}