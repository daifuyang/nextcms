import path from "path";
import fs from "fs";
import xss from "xss";

type DataWithBigInt = {
  [key: string]: any;
};

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
  if (!html) {
    return;
  }
  return xss(html)
}

export function decodeEntities(encodedString: string) {
  if (!encodedString) {
    return '';
  }
  return 
}

export function stringify(obj: any) {
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  });
}

// 定义一个函数，用于将 BigInt 类型的值转换为字符串
export function convertBigIntToString(obj: DataWithBigInt): any {
  // 检查当前对象的类型
  if (typeof obj === 'bigint') {
      // 如果是 BigInt 类型，则将其转换为字符串
      return (obj as any).toString();
  } else if (Array.isArray(obj)) {
      // 如果是数组，则递归处理数组中的每个元素
      return obj.map(item => convertBigIntToString(item));
  } else if (typeof obj === 'object' && obj !== null) {
      // 如果是对象，则递归处理对象的每个属性值
      const newObj: DataWithBigInt = {};
      for (const key in obj) {
          newObj[key] = convertBigIntToString(obj[key]);
      }
      return newObj;
  }
  // 其他情况下直接返回原始值
  return obj;
}