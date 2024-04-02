import { Layout as AntdLayout } from "antd";

import Root from "./ui/root";
import SiderNav from "./ui/sider";
import Header from "./ui/header";
import Content from "./ui/content";
import dynamic from "next/dynamic";

import "./loading.css";
import { headers } from "next/headers";

const AdminAuth = dynamic(() => import("@/components/adminAuth"), {
  loading: () => (
    <div className="flex flex-col items-center justify-center h-screen min-h-[362px]">
      <div className="page-loading-warp">
        <div className="ant-spin ant-spin-lg ant-spin-spinning">
          <span className="ant-spin-dot ant-spin-dot-spin">
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
          </span>
        </div>
      </div>
      <div className="loading-title">正在加载资源</div>
      <div className="loading-sub-title">初次加载资源可能需要较多时间，请耐心等待</div>
    </div>
  ),
  ssr: false
});

export default function Layout(props: any) {
  const headersList = headers();

  const nextUrl = headersList.get("next-url");
  const { children } = props;


  if (nextUrl === "/admin/login") {
    return children;
  }

  return (
    <AdminAuth>
      <Root>
        <AntdLayout>
          <Header />
          <AntdLayout>
            <SiderNav />
            <AntdLayout>
              <Content>{children}</Content>
            </AntdLayout>
          </AntdLayout>
        </AntdLayout>
      </Root>
    </AdminAuth>
  );
}
