import { NextRequest } from "next/server";
import api from "@/utils/response";
import path from "path";
import crypto from "crypto";
import fs from "fs";
import { writeFile } from "fs/promises";
import getCurrentUser from "@/utils/user";
import { now } from "@/utils/date";
import { getResourceCount, getResourceList } from "@/model/resource";
import prisma from "@/utils/prisma";

export async function GET(request: NextRequest) {
  // 获取分页
  const { searchParams } = request.nextUrl;
  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const type = searchParams.get("type");
  if (!type) {
    return api.error("参数错误！");
  }

  const total = await getResourceCount({ type });
  const data = await getResourceList({ current, pageSize, type });

  return api.success("获取成功！", {
    total,
    current,
    pageSize,
    data
  });
}

export async function POST(request: NextRequest) {
  const { origin } = request.nextUrl;

  const formData = await request.formData();

  let type = "";
  let categoryId = "1";
  let files: any = [];
  const entries = formData.entries();
  let entry = entries.next();
  while (!entry.done) {
    if (entry.value[0] == "files[]") {
      files.push(entry.value[1]);
    } else if (entry.value[0] == "type") {
      type = entry.value[1].toString();
    }else if (entry.value[0] == "categoryId") {
      categoryId = entry.value[1].toString();
    }
    entry = entries.next();
  }

  if (files?.length <= 0) {
    return api.error("文件不能为空！");
  }

  // 类型枚举
  const typeEumn = ["image", "audio", "video", "file"];
  if (!typeEumn.includes(type)) {
    return api.error("文件类型不正确！");
  }

  const { userId, loginName } = getCurrentUser(request);

  let data = [];

  for (const file of files) {
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
    });

    if (exist) {
      if (exist.deletedAt > 0) {
        await prisma.cmsResource.update({
          where: {
            id: exist.id
          },
          data: {
            deletedAt: 0,
            updatedAt: now()
          }
        });
      }

      data.push({
        name: exist.name,
        filePath: exist.filePath,
        prevPath: origin + `/${exist.filePath}`
      });
    } else {
      const sha1Hash = crypto.createHash("sha1");
      sha1Hash.update(buffer);
      const sha1Value = sha1Hash.digest("hex");

      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      // const day = date.getDate().toString().padStart(2, "0");

      // // 获取时间戳
      const savename = `${md5Value}${ext}`;

      // todo 以后完善文件名生成算法

      const uploadPath = `upload/${year}/${month}/`;
      const directory = path.join(process.cwd(), `public/${uploadPath}`);

      // 判断文件夹是否存在
      if (!fs.existsSync(directory)) {
        // 创建文件夹
        fs.mkdirSync(directory, { recursive: true });
      }

      // Write the file to the specified directory with the modified filename
      await writeFile(directory + savename, buffer);

      // 存入数据库
      const resource = await prisma.cmsResource.create({
        data: {
          name: filename,
          categoryId,
          filePath: uploadPath + savename,
          md5: md5Value,
          sha1: sha1Value,
          fileType: type,
          createId: userId,
          creator: loginName,
          updateId: userId,
          updater: loginName,
          createdAt: now(),
          updatedAt: now()
        }
      });

      data.push({
        name: resource.name,
        filePath: resource.filePath,
        prevPath: origin + `/${resource.filePath}`
      });
    }
  }

  return api.success("上传成功！", {
    data
  });
}
