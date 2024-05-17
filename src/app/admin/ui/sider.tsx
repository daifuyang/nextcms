"use client";

import { Layout as AntdLayout, Menu, Button, theme } from "antd";
import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  MenuFoldOutlined,
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

function findParentKey(routes: any, key: string) {
  for (let route of routes) {
    // 检查当前路由是否有子路由
    if (route.children) {
      // 遍历子路由
      for (let child of route.children) {
        // 如果找到匹配的路径，则返回父级路径
        if (child.path === key) {
          return route.path;
        }
      }
      // 递归检查子路由
      const parentPath = findParentKey(route.children, key);
      if (parentPath) {
        return route.path;
      }
    }
  }
  // 如果没有找到匹配的路径，返回null
  return null;
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

  
  const parentPathname = findParentKey(routes, pathname)

  const items = getRoutes(routes);

  return (
    <AntdSider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={<Trigger />}
    >
      <Menu mode="inline" theme="light" defaultOpenKeys={[parentPathname]} selectedKeys={[pathname]} items={items} />
    </AntdSider>
  );
}
