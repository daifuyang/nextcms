"use server";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { cookies } from 'next/headers';
import prisma from "@/utils/prisma";
import dayjs from "dayjs";
import { redirect } from "next/navigation";

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

    if(!user) {
      return { user: null, token: null, message: "账号不存在！", status: "error" };
    }

    // 比对密码
    const userPassword = user.password || '';
    const isMatch = await bcrypt.compare(password, userPassword);
    if ( !isMatch ) {
      return { user: null, token: null, message: "账号或密码不正确！", status: "error" };
    } else {

      const accessToken = jwt.sign({ userId: user.id }, "secret", { expiresIn: "1d" });
      const refreshToken = jwt.sign({ userId: user.id }, "refreshSecret", { expiresIn: "7d" }); // 7天过期
      const expiry = dayjs().add(1,"day").toDate()

      const token = {
        accessToken,
        tokenType: "Bearer",
        refreshToken,
        expiry
      };

      // 入库
      const userToken = await prisma.cmsUserToken.create({
          data: {
            userId:user.id,
            accessToken,
            refreshToken,
            expiry
          }
      })

      if(!userToken) {
        return {  message: "入库失败！", status: "error" };
      }

      cookies().set('token', JSON.stringify(token), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // One week
        path: '/',
      })
      
      redirect('/admin')
    }
  }
}
