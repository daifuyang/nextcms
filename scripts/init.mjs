import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

function now() {
  return Math.floor(new Date().getTime() / 1000);
}

async function main() {
  console.log("sql init start");

  // 创建初始管理员

  const admin = await prisma.cmsUser.findFirst({
    where: {
      loginName: "admin",
      userType: 1
    }
  });

  if (!admin) {
    const { DEFAULT_PASSWORD = "123456" } = process.env;
    const password = bcrypt.hashSync(DEFAULT_PASSWORD, bcrypt.genSaltSync(10));
    await prisma.cmsUser.create({
      data: {
        loginName: "admin",
        userType: 1,
        password,
        createId: 1,
        creator: "admin",
        updateId: 1,
        updater: "admin",
        createdAt: now(),
        updatedAt: now()
      }
    });
  }

  // 创建默认资源分类
  const assetsCategory = await prisma.cmsResourceCategory.count();
  if (!assetsCategory) {
    const defaultFields = {
      parentId: 0,
      createId: 1,
      creator: "admin",
      updateId: 1,
      updater: "admin",
      createdAt: Math.floor(Date.now() / 1000), // 当前时间的时间戳（秒）
      updatedAt: Math.floor(Date.now() / 1000), // 当前时间的时间戳（秒）
      deletedAt: 0
    };

    const defaultCategories = [
      {
        id: 1,
        name: "未分组",
        description: null,
        ...defaultFields
      },
      {
        id: 2,
        name: "富文本编辑器",
        description: null,
        ...defaultFields
      }
    ];

    await prisma.cmsResourceCategory.createMany({
      data: defaultCategories
    });

    console.log("sql init finished");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
