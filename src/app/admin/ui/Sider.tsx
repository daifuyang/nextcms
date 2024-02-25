"use client"

import { Layout as AntdLayout, Menu, Button, theme } from 'antd';
import { useState } from 'react';

import {
    MenuFoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';

const { Sider: AntdSider } = AntdLayout;

function Trigger() {
    return (
        <div className="sider-trigger">
            <MenuFoldOutlined style={{
                fontSize: '14px',
            }} />
        </div>
    )
}

export default function Sider() {

    const [collapsed, setCollapsed] = useState(false);

    const items = [
        {
            key: '1',
            icon: <UserOutlined />,
            label: '概述',
        },
        {
            key: '2',
            icon: <VideoCameraOutlined />,
            label: '文章',
        },
        {
            key: '3',
            icon: <UploadOutlined />,
            label: '资源',
        },
        {
            key: '4',
            icon: <UploadOutlined />,
            label: '表单',
        },
        {
            key: '5',
            icon: <UploadOutlined />,
            label: '用户',
        },
        {
            key: '6',
            icon: <UploadOutlined />,
            label: '设置',

        },
    ]

    return (
        <AntdSider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} trigger={<Trigger />}>
            <Menu
                mode="inline"
                theme='light'
                defaultSelectedKeys={['1']}
                items={items}
            />
        </AntdSider>
    )
}