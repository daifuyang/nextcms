import _ from "lodash";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import bcrypt from "bcrypt";
import api from "@/utils/response";
import prisma from "@/utils/prisma";
import { timestamp } from "@/utils/date";

export async function POST(request: Request) {
  const data = await request.json();
  const { account, password } = data;
  if (!_.trim(account)) {
    return api.error("账号不能为空");
  } else if (!_.trim(password)) {
    return api.error("密码不能为空");
  }

  const user = await prisma.cmsUser.findFirst({
    where: {
      loginName: account
    }
  });

  if (!user) {
    return api.error("该用户不存在！");
  }

  // 比对密码
  const userPassword = user.password || "";
  const isMatch = await bcrypt.compare(password, userPassword);
  if (!isMatch) {
    return api.error("账号或密码不正确！");
  } else {
    const accessToken = jwt.sign({ userId: user.id }, "secret", { expiresIn: "7d" });
    const refreshToken = jwt.sign({ userId: user.id }, "refreshSecret", { expiresIn: "7d" }); // 7天过期
    const expiryAt = dayjs().add(7, "day").unix();

    const token = {
      accessToken,
      tokenType: "Bearer",
      refreshToken,
      expiryAt
    };

    // 入库
    const userToken = await prisma.cmsUserToken.create({
      data: {
        userId: user.id,
        accessToken,
        refreshToken,
        expiryAt,
        createdAt: timestamp(),

      }
    });

    if (!userToken) {
      return api.error("登录失败！");
    }

    return api.success("登录成功！", token);
  }
}
