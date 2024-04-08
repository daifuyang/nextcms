import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect
} from "@ant-design/pro-components";
import { Button, Form, message, Image } from "antd";
import { useState } from "react";
import { addArticleCategories, articleCategoriesTree } from "@/services/articleCategory";

interface FormProps {
  title: string;
}

interface Props {
  title: string;
  onFinish?: () => void;
  children: JSX.Element | undefined; // 或者具体的组件类型
  initialValues?: any; // 根据实际情况指定类型
}

export default function Save(props: Props) {

  const { onFinish, children, initialValues, title } = props

  const [form] = Form.useForm<FormProps>();


  return (
    <ModalForm<FormProps>
      title={title}
      width={"40%"}
      trigger={
        children
      }
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      form={form}
      modalProps={{
        destroyOnClose: true,
      }}
      initialValues={initialValues}
      onFinish={async (values) => {
        const res = await addArticleCategories(values);
        if (res.code === 1) {

          if (onFinish) {
            onFinish()
          }

          return true
        }
        message.error(res.msg);
        return false;
      }}
    >
      <ProFormTreeSelect
        fieldProps={{
          style: { maxWidth: 288 },
          fieldNames: {
            value: 'id',
            label: 'name',
          }
        }}
        label="父级分类"
        name="parentId"
        request={async () => {

          const res = await articleCategoriesTree();
          if (res.code !== 1) {
            message.error(res.msg);
          }

          return [
            {
              name: '作为一级分类',
              id: 0
            },
            ...res.data
          ]
        }}
      />
      <ProFormText label="名称" name="name" />
      <ProFormText label="自定义url" name="alias" />
      <ProForm.Item label="图标" name="icon">
        <Image
          width={80}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </ProForm.Item>
      <ProFormTextArea label="描述" name="description" />

      <ProFormDigit label="排序" name="order" min={0} fieldProps={{ precision: 0 }} />

      <ProFormRadio.Group
        name="status"
        label="状态"
        initialValue={1}
        options={[{ label: '启用', value: 1 }, { label: '禁用', value: 0 }]}
      />
    </ModalForm>
  );
}
