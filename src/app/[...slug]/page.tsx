import { getPage } from "@/services/app/page";
import { notFound } from "next/navigation";
import pathToRegexp, { Key } from "path-to-regexp";
import ReactRender from "../ReactRender";

interface Props {
  params: {
    slug: string[];
  };
}

// 构建匹配规则
interface RouteMatcher {
  regexp: RegExp;
  type: string;
  pageId: string;
  targetId?: string;
  keys: Key[];
}

// 匹配路由
interface MatchedRoute {
  type: string;
  pageId: string;
  targetId?: string;
  params?: { [key: string]: string };
}

/*
 ** 定义默认路由示例
 ** 首页 -> /
 ** 文章页 -> article-1 // article-${id}
 ** 分类页 -> category/1 // category/${id}
 ** 页面 -> page-1 // page-${id}
 ** 搜索列表 -> search/keywords // search/${keywords}
 ** 标签列表 -> tag/1 // tag/${id}
 */

// 定义示例数据格式
const demoRoutes = [
  {
    regexp: "about",
    type: "page",
    pageId: "4"
  },
  {
    regexp: "news",
    type: "category-list",
    pageId: "3",
    targetId: "1"
  },
  {
    regexp: "news/:id",
    type: "category-article",
    pageId: "4",
    targetId: "1"
  },
  {
    regexp: "readme",
    type: "article",
    pageId: "4",
    targetId: "1"
  }
];

const matchRoute = (path: string, routeMatchers: RouteMatcher[]): MatchedRoute | null => {
  for (const route of routeMatchers) {
    const match = route.regexp.exec(path);
    if (match) {
      const params: { [key: string]: string } = {};
      route.keys.forEach((key, index) => {
        params[key.name] = match[index + 1];
      });
      return { type: route.type, pageId: route.pageId, targetId: route.targetId, params };
    }
  }
  return null;
};

export default async function Page(props: Props) {
  const { slug } = props.params;
  const currentPath = slug.join("/");
  const routeMatchers: RouteMatcher[] = demoRoutes.map((route) => {
    const keys: Key[] = [];
    const regexp: RegExp = pathToRegexp(route.regexp, keys);
    return { regexp, type: route.type, pageId: route.pageId, targetId: route.targetId, keys };
  });
  const matchedRoute = matchRoute(currentPath, routeMatchers);
  let schema = null;
  if (matchedRoute) {
    const { pageId } = matchedRoute;
    const res = await getPage(pageId);
    if (res.code === 0) {
      notFound();
    }

    schema = res.data.schema;

    // 根据pageId获取schema
    switch (matchedRoute.type) {
      case "page":
        break;
    }
  } else {
    notFound();
  }
  return <ReactRender schema={schema} />;
}
