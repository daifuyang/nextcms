import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";
import crypto from "crypto";
import fs from 'fs';
import api from "@/utils/response";

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();
  const file: any = formData.get("file");

  if (!file) {
    return api.error("文件不能为空！");
  }

  const ext = path.extname(file.name);

  // Convert the file data to a Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // 计算MD5
  const md5Hash = crypto.createHash('md5');
  md5Hash.update(buffer);
  const md5Value = md5Hash.digest('hex');

  // 计算 SHA1
  const sha1Hash = crypto.createHash('sha1');
  sha1Hash.update(buffer);
  const sha1Value = sha1Hash.digest('hex');

  console.log("MD5:", md5Value,sha1Value);

  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  // 获取时间戳
  const timestamp = Math.floor(date.getTime() / 1000);
  const filename = `${timestamp}.${ext}`;
  console.log('filename',filename)
  const directory = path.join(process.cwd(), `public/upload/${year}/${month}/${day}/`);

  // 判断文件夹是否存在
  if (!fs.existsSync(directory)) {
      // 创建文件夹
      fs.mkdirSync(directory, { recursive: true });
  }

  try {
    // Write the file to the specified directory (public/assets) with the modified filename
    await writeFile(path.join(process.cwd(), `public/upload/${directory}` + filename), buffer);

    // Return a JSON response with a success message and a 201 status code
    return api.success("上传成功！");
  } catch (error: any) {
    // If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code

    return api.success(error.message);
  }
};
