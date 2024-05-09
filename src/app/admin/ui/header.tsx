"use client";

import { Layout as AntdLayout, Avatar, Dropdown, MenuProps, theme } from "antd";
import Image from "next/image";
import withTheme from "../theme";
import { UserOutlined } from "@ant-design/icons";
import { useAppSelector } from "@/redux/store";
const { Header: AntdHeader } = AntdLayout;

export default function Header() {
  const { token } = theme.useToken();
  const { headerBg } = token.Layout || {};
  const user = useAppSelector((state) => state.userState.user);

  const items: MenuProps["items"] = [
    {
      key: "website",
      label: "网站信息"
    },
    {
      key: "user",
      label: "个人信息"
    },
    {
      key: "password",
      label: "密码修改"
    },
    {
      key: "exit",
      label: "退出登录"
    }
  ];

  return (
    <AntdHeader style={{ padding: 0, backgroundColor: headerBg }}>
      <div className="global-header">
        <div className="global-header-logo">
          <a href="">
            <Image src="/assets/logo.svg" alt="logo" width={28} height={28} />
            <h1>NextCMS</h1>
          </a>
        </div>
        <div className="global-header-content">
          <div className="global-header-content-nav"></div>
          <div className="global-header-content-right">
            <Dropdown menu={{ items }}>
              <div className="global-header-content-avatar">
                <span className="global-header-content-nickname">
                  {user?.nickname || user?.loginName || "未设置"}
                </span>
                <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    </AntdHeader>
  );
}
