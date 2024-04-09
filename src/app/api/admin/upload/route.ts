import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import crypto from "crypto";
import fs from "fs";
import api from "@/utils/response";
import prisma from "@/utils/prisma";
import getCurrentUser from "@/utils/user";

export const POST = async (request: NextRequest) => {

  const {origin} = request.nextUrl;

  const formData = await request.formData();
  const file: any = formData.get("file");

  if (!file) {
    return api.error("文件不能为空！");
  }

  const fileType = formData.get("type") as string;

  if (!fileType) {
    return api.error("文件类型不能为空！");
  }

  // 类型枚举
  const typeEumn = ["image", "video", "file"];
  if (!typeEumn.includes(fileType)) {
    return api.error("文件类型不正确！");
  }

  const { userId, loginName } = getCurrentUser(request);

  const filename = file.name;
  const ext = path.extname(file.name);

  // Convert the file data to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // 计算MD5
  const md5Hash = crypto.createHash("md5");
  md5Hash.update(buffer);
  const md5Value = md5Hash.digest("hex");

  //判定是否存在相同的文件
  const exist = await prisma.cmsResource.findFirst({
    where: {
      md5: md5Value
    }
  })

  if(exist) {
    return api.success("上传成功！", {
      name: exist.name,
      filePath: exist.filePath,
      prevPath: origin + `/${exist.filePath}`
    })
  }

  // 计算 SHA1
  const sha1Hash = crypto.createHash("sha1");
  sha1Hash.update(buffer);
  const sha1Value = sha1Hash.digest("hex");

  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  // // 获取时间戳
  const savename = `${md5Value}${ext}`;

  // todo 以后完善文件名生成算法

  const uploadPath = `upload/${year}/${month}/${day}/`;
  const directory = path.join(process.cwd(), `public/${uploadPath}`);

  // 判断文件夹是否存在
  if (!fs.existsSync(directory)) {
    // 创建文件夹
    fs.mkdirSync(directory, { recursive: true });
  }

  try {
    // Write the file to the specified directory with the modified filename
    await writeFile(directory + savename, buffer);

    // 存入数据库
    const resource = await prisma.cmsResource.create({
      data: {
        name: filename,
        filePath: uploadPath + savename,
        md5: md5Value,
        sha1: sha1Value,
        fileType,
        createId: userId,
        creator: loginName,
        updateId: userId,
        updater: loginName
      }
    });

    // Return a JSON response with a success message and a 201 status code
    return api.success("上传成功！", {
      name: resource.name,
      filePath: resource.filePath,
      prevPath: origin + `/${resource.filePath}`
    });
  } catch (error: any) {
    // If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code

    return api.error(error.message);
  }
};
