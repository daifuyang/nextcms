"use client";

import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Divider, Popconfirm, Space, Tag, message } from "antd";
import { useRef } from "react";
import { deleteArticle, getArticles } from "@/services/admin/article";
import Save from "./save";
import dayjs from "dayjs";

export default function List() {
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<any>[] = [
    {
      title: "标题",
      dataIndex: "title"
    },
    {
      title: "分类",
      dataIndex: "categoryId",
      render: (_, record) => {
        return record.category?.map((item: any) => {
          return (
            <Tag color="processing" key={item.id}>
              {item.name}
            </Tag>
          );
        });
      }
    },
    {
      title: "更新时间",
      dataIndex: "updatedTime",
      hideInSearch: true
    },
    {
      title: "发布人",
      dataIndex: "creator",
      hideInSearch: true
    },
    {
      title: "发布状态",
      dataIndex: "articleStatus",
      renderText: (_, record) => {
        return record.articleStatus === 1 ? "已发布" : "未发布";
      }
    },
    {
      title: "操作",
      width: 150,
      valueType: "option",
      render: (text, record, _, action) => {
        const categoryIds = record.category?.map?.((item: any) => {
          return {
            value: item.id,
            label: item.name
          };
        });
        const publishedAt = dayjs.unix(record.publishedAt);
        return (
          <Space split={<Divider />}>
            <Save
              title="编辑文章"
              key="editable"
              onFinish={() => {
                actionRef.current?.reload();
              }}
              initialValues={{ ...record, categoryIds, publishedAt }}
            >
              <a key="editable">编辑</a>
            </Save>
            <a key="view" onClick={() => {}}>
              查看
            </a>
            <Popconfirm
              title="确定删除吗?"
              onConfirm={async () => {
                const res = await deleteArticle(record.id);
                if (res.code !== 1) {
                  message.error(res.msg);
                  return;
                }
                message.success(res.msg);
                actionRef.current?.reload();
              }}
            >
              <a style={{ color: "#ff4d4f" }} key="del">
                删除
              </a>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  return (
    <>
      <ProTable<any>
        columns={columns}
        actionRef={actionRef}
        request={async (params, sort, filter) => {
          const res: any = await getArticles(params);
          if (res.code === 1) {
            return {
              success: true,
              data: res.data.data,
              total: res.data.total
            };
          }

          return {
            success: false
          };
        }}
        editable={{
          type: "multiple"
        }}
        rowKey="id"
        search={{
          labelWidth: "auto"
        }}
        pagination={{
          pageSize: 10
        }}
        headerTitle="文章列表"
        toolBarRender={() => [
          <Save
            key="Save"
            onFinish={() => {
              actionRef.current?.reload();
            }}
          />
        ]}
      />
    </>
  );
}
