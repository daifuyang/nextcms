"use server";

import crypto from "crypto";
import prisma from "@/model";

export default async function login(prevState: any, formData: FormData) {
  const account = formData.get("account")?.toString();
  const password = formData.get("password")?.toString();

  if (password) {
    const user = await prisma.cmsUser.findFirst({
      where: {
        loginName: account,
        userType: 1
      }
    });

    // 比对密码
    const hash = crypto.createHash("sha256");
    // 更新哈希对象的内容
    hash.update(password);
    const hashedPassword = hash.digest("hex");
    if (hashedPassword !== user?.password) {
      return { user: "", message: "账号或密码不正确！", status: "error" };
    } else {
      if (user?.password) {
        delete user.password;
      }

      return {
        user,
        message: "登录成功！",
        status: "ok"
      };
    }
  }
}
