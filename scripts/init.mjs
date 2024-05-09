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

  console.log("sql init finished");
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
