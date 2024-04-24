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

    if(config) {
        return success("获取成功！",config)
    }
    
}

// 修改或新增一个配置
export async function POST(request: Request, { params }: { params: { key: string } }) {
  const { key } = params;

  const json = await request.json();
  let { value } = json;
  if (!value) {
    return error("值不能为空！");
  }

  value = value.toString()

  // 查询当前key是否存在
  const config = await prisma.systemConfig.findFirst({
    where: {
      key
    }
  });

  // 存在则修改
  let res;
  if (config) {
    res = await prisma.systemConfig.update({
      where: {
        id: config.id
      },
      data: {
        value: value
      }
    });
  } else {
    res = await prisma.systemConfig.create({
      data: {
        key,
        value
      }
    });
  }

  return success("操作成功！",res)
}
