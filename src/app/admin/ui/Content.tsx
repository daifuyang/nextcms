"use client"

import { Layout as AntdLayout, Breadcrumb } from 'antd';
const { Content: AntdContent } = AntdLayout;

export default function Content(props: any) {
    const { children } = props;

    const items = [
        {
            title: '首页',
        },
        {
            title: <a href="">菜单一</a>,
        },
        {
            title: <a href="">菜单二</a>,
        },
        {
            title: '详情页',
        },
    ]

    return (
        <AntdLayout style={{ padding: '0 24px 24px' }}>
            <Breadcrumb style={{ margin: '16px 0' }} items={items} />
            <AntdContent>
                {children}
            </AntdContent>
        </AntdLayout>
    )
}