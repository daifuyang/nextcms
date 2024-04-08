import prisma from "@/utils/prisma";
import api from "@/utils/response";
import { isNumberEmpty } from "@/utils/validator";
import { NextRequest } from "next/server";

interface TreeNode {
  id: number;
  parentId: number;
  seoTitle: string | null;
  seoKeywords: string | null;
  seoDescription: string | null;
  name: string;
  icon: string | null;
  description: string | null;
  status: number | null;
  count: number;
  path: string;
  order: number | null;
  createId: number;
  creator: string;
  updateId: number;
  updater: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  children?: TreeNode[];
}

function dataToTree(data: TreeNode[]): TreeNode[] {
  const map: { [key: number]: TreeNode } = {};
  const tree: TreeNode[] = [];

  data.forEach((node) => {
    map[node.id] = { ...node };
  });

  data.forEach((node) => {
    if (node.parentId !== 0) {
      const parent = map[node.parentId];
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(map[node.id]);
      }
    } else {
      tree.push(map[node.id]);
    }
  });

  return tree;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const where: any = {
    deletedAt: null
  }
  
  const name = searchParams.get("name") || "";
  if (name) {
    where.name = {
      contains: name
    };
  }
  const status = searchParams.get("status") || '';
  const statusInt = parseInt(status);
  if (!isNumberEmpty(status)) {
    where.status = statusInt
  }

  const categories = await prisma.cmsArticleCategory.findMany({
    where
  });
  let treeData: any = [];
  if (categories) {
    treeData = dataToTree(categories);
  }
  return api.success("获取成功！", treeData);
}
