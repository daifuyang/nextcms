"use client";

import React from "react";
import { ProTable, ProColumns } from "@ant-design/pro-components";
import { Divider, Space } from "antd";
import Save from './save'
import { addArticleCategories } from "@/services/articleCategory";


interface Category {
  id: string; // 分类ID
  parentId: string | null; // 父级分类ID，默认为顶级分类
  name: string; // 分类名称
  description: string; // 分类描述
  status: "active" | "inactive"; // 分类状态
  count: number; // 文章数
}

const data: Category[] = [
  {
    id: "1",
    parentId: null,
    name: "科技",
    description: "关于科技的文章分类",
    status: "active",
    count: 50
  },
  {
    id: "2",
    parentId: "1",
    name: "人工智能",
    description: "关于人工智能的文章分类",
    status: "active",
    count: 20
  },
  {
    id: "3",
    parentId: "1",
    name: "区块链",
    description: "关于区块链的文章分类",
    status: "active",
    count: 15
  },
  {
    id: "4",
    parentId: null,
    name: "生活",
    description: "关于生活的文章分类",
    status: "active",
    count: 30
  }
];

const category: React.FC = () => {
  const columns: ProColumns<Category>[] = [
    {
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "父级ID",
      dataIndex: "parentId"
    },
    {
      title: "名称",
      dataIndex: "name"
    },
    {
      title: "描述",
      dataIndex: "description"
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: {
        active: { text: "启用", status: "Success" },
        inactive: { text: "停用", status: "Error" }
      }
    },
    {
      title: "文章数",
      dataIndex: "count",
      sorter: (a, b) => a.count - b.count
    },
    {
      title: "操作",
      valueType: "option",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <a key="edit" onClick={() => {}}>
            编辑
          </a>
          <a key="delete" onClick={() => {}}>
            删除
          </a>
        </Space>
      )
    }
  ];

  return (
    <ProTable<Category>
      headerTitle="文章分类"
      request={async (params, sort, filter) => {
        const res = await addArticleCategories(params);
        if (res.code == 1) {
          return {
            success: true,
            data: res.data
          };
        }
        return {
          success: false
        };
      }}
      search={{ labelWidth: "auto" }}
      columns={columns}
      dataSource={data}
      rowKey="id"
      toolBarRender={() => [<Save key="modalSave" />]}
    />
  );
};

export default category;
