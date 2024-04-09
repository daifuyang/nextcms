import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  DrawerForm,
  ProForm,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect
} from "@ant-design/pro-components";
import { Button, Form, message } from "antd";
import { getArticleCategoriesTree } from "@/services/articleCategory";
import Editor from "@/components/lexical";
import MyUpload from "@/components/uoload";

interface ModalFormProps {
  title: string;
}

export default function Save() {
  const [form] = Form.useForm<ModalFormProps>();

  const [title, setTitle] = useState<string>("新增文章");

  return (
    <DrawerForm<ModalFormProps>
      title={title}
      width={"80%"}
      trigger={
        <Button icon={<PlusOutlined />} type="primary">
          新建
        </Button>
      }
      form={form}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        message.success("提交成功");
        return true;
      }}
    >
      <ProFormTreeSelect
        fieldProps={{
          style: { width: 288 },
          fieldNames: {
            value: 'id',
            label: 'name',
          }
        }}
        label="分类"
        name="categoryId"
        request={async () => {
          const res = await getArticleCategoriesTree();
          if (res.code !== 1) {
            message.error(res.msg);
          }
          return res.data;
        }}
        rules={[{ required: true, message: '请选择父级分类' }]}
      />
      <ProFormText label="标题" name="title" rules={[{ required: true, message: '标题不能为空' }]} />
      <ProFormSelect mode="tags" label="标签" name="keywords" />
      <ProFormDateTimePicker fieldProps={{
        style: { width: 288 },
      }} label="发布日期" name="published_time" />
      <ProForm.Item label="封面" name="thumbnail">
        <MyUpload type="image" />
      </ProForm.Item>
      <ProFormText
        fieldProps={{
          style: { width: 288 },
        }}
        label="作者"
        name="author"
      />
      <ProFormTextArea label="摘要" name="excerpt" />

      <ProForm.Item label="详情" name="content">
        <Editor />
      </ProForm.Item>

      <ProFormText label="自定义url" name="alias" />
    </DrawerForm>
  );
}
