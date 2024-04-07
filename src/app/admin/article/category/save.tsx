import { PlusOutlined } from "@ant-design/icons";
import {
  ModalForm,
  ProForm,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect
} from "@ant-design/pro-components";
import { Button, Form, message, Image } from "antd";
import { useState } from "react";
import Editor from "@/components/lexical";

interface FormProps {
  title: string;
}

export default function Save() {

  const [form] = Form.useForm<FormProps>();
  const [title, setTitle] = useState<string>("添加分类");

  return (
    <ModalForm<FormProps>
      title={title}
      width={"40%"}
      trigger={
        <Button icon={<PlusOutlined />} type="primary">
          新建
        </Button>
      }
      layout="horizontal"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 18 }}
      form={form}
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={async (values) => {
        console.log('values', values)
        message.success("提交成功");
        return true;
      }}
    >
      <ProFormTreeSelect
        fieldProps={{
          style: { maxWidth: 288 }
        }}
        label="父级分类"
        name="parentId"
        request={async () => {
          return [{
            label: '作为一级分类',
            value: 0
          }]
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
