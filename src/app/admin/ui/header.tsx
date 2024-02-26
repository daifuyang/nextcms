"use client";

import { MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout as AntdLayout, Button, theme } from "antd";
import withTheme from "../theme";
const { Header: AntdHeader } = AntdLayout;

export default function Header() {
    const { token } = theme.useToken();
    const { headerBg } = token.Layout || {};

    return (
        <AntdHeader style={{ padding: 0, backgroundColor: headerBg }}>
            <div className="global-header">
                <div className="global-header-logo">
                    <a href="">
                        <img
                            src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                            alt="logo"
                        />
                        <h1>NextCMS</h1>
                    </a>
                </div>
            </div>
        </AntdHeader>
    );
}
