import path from "path";
import fs from "fs";

export function getFileSchema(filePath: string) {
  // 读取本地schema文件
  if (filePath) {
    const file = path.resolve(process.cwd(), filePath);
    const jsonData = fs.readFileSync(file, "utf8");
    if (jsonData) {
      return JSON.parse(jsonData);
    }
    return null;
  }
}
