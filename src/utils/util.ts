import path from "path";
import fs from "fs";

export function assignSchema(schema: any, publicSchema: any, position: "start" | "end" = "end") {
  if (publicSchema) {
    if (position == "start") {
      schema.children = schema.children?.filter((n: any) => n.componentName !== "Header");
      schema.children.unshift(publicSchema);
    } else {
      schema.children = schema.children?.filter((n: any) => n.componentName !== "Footer");
      schema.children.push(publicSchema);
    }
  }
}

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

export function escapeHTML(html: string) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&apos;")
    .replace(/"/g, "&quot;");
}

export function decodeEntities(encodedString: string) {
  return encodedString
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}
