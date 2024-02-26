"use client";

import { Layout as AntdLayout, Menu, Button, theme } from "antd";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  MenuFoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const { Sider: AntdSider } = AntdLayout;

function Trigger() {
  return (
    <div className="sider-trigger">
      <MenuFoldOutlined
        style={{
          fontSize: "14px"
        }}
      />
    </div>
  );
}

function getRoutes(routes: any) {
  if (!routes?.length) {
    return undefined;
  }

  const items = routes?.map((item) => {
    let hasChildren = true;

    if (!item?.children?.length) {
      hasChildren = false;
    }

    const name = item.name ? item.name : "未定义";

    const path = item.path;
    const key = path;

    const children = getRoutes(item?.children);

    return {
      key,
      label: hasChildren ? name : <Link href={key}>{name}</Link>,
      children
    };
  });

  return items;
}

export default function Sider() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);

  const routes = useSelector((state: RootState) => state.initialStateReducer.initialState.routes);

  const items = getRoutes(routes);

  return (
    <AntdSider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={<Trigger />}
    >
      <Menu mode="inline" theme="light" selectedKeys={[pathname]} items={items} />
    </AntdSider>
  );
}
