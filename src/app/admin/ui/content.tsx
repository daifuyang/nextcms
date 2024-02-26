"use client";

import { RootState } from "@/redux/store";
import { Layout as AntdLayout, Breadcrumb } from "antd";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
const { Content: AntdContent } = AntdLayout;

interface PathItem {
  path: string;
  name: string;
  children?: PathItem[];
}

interface Breadcrumb {
  title: string | JSX.Element;
}

const findPathItem = (path: string, pathList: PathItem[]): PathItem | undefined => {
  for (const key in pathList) {
    const item = pathList[key];
    if (item.path === path) {
      return item;
    } else if (item.children) {
      const children = findPathItem(path, item.children);
      if (children) {
        return children;
      }
    }
  }
  return undefined
};

const getCurrentBreadcrumb = (path: string, pathList: PathItem[]): Breadcrumb[] => {
  const breadcrumbs: Breadcrumb[] = [];

  const segments = path.split("/").filter((segment) => segment !== "");
  let current = "";

  segments.forEach((segment) => {
    current += `/${segment}`;
    const foundItem = findPathItem(current, pathList);
    if (foundItem) {
      breadcrumbs.push({
        title: foundItem.name
      });
    }
  });

  return breadcrumbs;
};

export default function Content(props: any) {
  const { children } = props;
  const { routes = [] } = useSelector((state: RootState) => state.initialStateReducer.initialState);

  const pathname = usePathname();

  const items = getCurrentBreadcrumb(pathname, routes);
  console.log("items", items);

  //   const items = [
  //     {
  //       title: "首页"
  //     },
  //     {
  //       title: <a href="">菜单一</a>
  //     },
  //     {
  //       title: <a href="">菜单二</a>
  //     },
  //     {
  //       title: "详情页"
  //     }
  //   ];

  return (
    <AntdLayout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }} items={items} />
      <AntdContent>{children}</AntdContent>
    </AntdLayout>
  );
}
