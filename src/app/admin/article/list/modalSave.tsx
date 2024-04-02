import { PlusOutlined } from "@ant-design/icons";
import {
    DrawerForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect
} from "@ant-design/pro-components";
import { Button, Form, message, Image } from "antd";
import { useState } from "react";
import Editor from "@/components/lexical";

interface ModalFormProps {
  title: string;
}

export default function ModalSave() {
  const [form] = Form.useForm<ModalFormProps>();

  const [title, setTitle] = useState<string>("新增文章");

  return (
    <DrawerForm<ModalFormProps>
      title={title}
      width={'80%'}
      trigger={
        <Button icon={<PlusOutlined />} type="primary">
          新建
        </Button>
      }
      form={form}
      autoFocusFirstInput
      drawerProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        message.success("提交成功");
        return true;
      }}
    >
      <ProFormTreeSelect label="分类" name="categoryId" />
      <ProFormText label="标题" name="title" />
      <ProFormSelect label="标签" name="keywords" />
      <ProFormDateRangePicker label="发布日期" name="published_time" />
      <ProForm.Item label="封面" name="thumbnail">
        <Image
          width={200}
          src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        />
      </ProForm.Item>
      <ProFormText label="作者" name="author" />
      <ProFormTextArea label="摘要" name="excerpt" />

      <ProForm.Item label="详情" name="content">
        <Editor />
      </ProForm.Item>

      <ProFormText label="自定义url" name="alias" />
    </DrawerForm>
  );
}
