"use client";

import React, { useRef } from "react";
import { ProTable, ProColumns, ActionType } from "@ant-design/pro-components";
import { Button, Divider, Popconfirm, Space, Typography, message } from "antd";
import Save from './save'
import { articleCategoriesTree, deleteCategories } from "@/services/articleCategory";
import { PlusOutlined } from "@ant-design/icons";

const { Text, Link } = Typography;


interface ICategory {
  id: string; // 分类ID
  parentId: string | null; // 父级分类ID，默认为顶级分类
  name: string; // 分类名称
  description: string; // 分类描述
  status: "active" | "inactive"; // 分类状态
  count: number; // 文章数
}

// 状态枚举
const statusEnum: any = {
  active: 1,
  inactive: 0
}

const Category: React.FC = () => {

  const ref = useRef<ActionType>();

  const columns: ProColumns<ICategory>[] = [
    {
      title: "ID",
      dataIndex: "id",
      hideInSearch: true
    },
    {
      title: "父级ID",
      dataIndex: "parentId",
      hideInSearch: true,
      hideInTable: true
    },
    {
      title: "名称",
      dataIndex: "name"
    },
    {
      title: "描述",
      dataIndex: "description",
      hideInSearch: true
    },
    {
      title: "状态",
      dataIndex: "status",
      valueEnum: {
        active: { text: "启用" },
        inactive: { text: "停用" }
      },
      renderText: (record) => {
        return record === 1 ? '启用' : '停用'
      }
    },
    {
      title: "文章数",
      dataIndex: "count",
      hideInSearch: true
    },
    {
      title: "操作",
      width: 220,
      valueType: "option",
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Save title="编辑分类" initialValues={record} onFinish={() => {
            ref.current?.reload();
          }}>
            <a>
              编辑
            </a>
          </Save>
          <Save title="新建分类" initialValues={{ parentId: record.id }} onFinish={() => {
            ref.current?.reload();
          }}>
            <a>
              新建子分类
            </a>
          </Save>

          <Popconfirm title="您确定删除吗？" onConfirm={ async () => {
            const res = await deleteCategories(record.id)
            if(res.code === 1) {
              ref.current?.reload();
              return
            }
              message.error(res.msg)
          }}>
            <Text className="cursor-pointer" type="danger">
              删除
            </Text>
          </Popconfirm>

        </Space>
      )
    }
  ];

  return (
    <ProTable<ICategory>
      actionRef={ref}
      headerTitle="文章分类"
      request={async (params: any, sort, filter) => {
        params.status = params.status ? statusEnum[params.status] : ''
        const res = await articleCategoriesTree(params);
        if (res.code === 1) {
          return {
            success: true,
            data: res.data,
          };
        }
        return {
          success: false
        };
      }}
      pagination={false}
      search={{ labelWidth: "auto" }}
      columns={columns}
      rowKey="id"
      toolBarRender={() => [<Save title="新建分类" onFinish={() => {
        ref.current?.reload();
      }} key="modalSave" ><Button icon={<PlusOutlined />} type="primary">
          新建
        </Button></Save>]}
    />
  );
};

export default Category;
