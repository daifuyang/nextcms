import { getPage } from "@/services/app/page";
import { getArticle } from "@/services/app/article";
import { notFound } from "next/navigation";
import pathToRegexp, { Key } from "path-to-regexp";
import ReactRender from "../ReactRender";
import articleSchema from "@/template/article.json";

interface Props {
  params: {
    slug: string[];
  };
}

// 构建匹配规则
interface RouteMatcher {
  regexp: RegExp;
  type: string;
  url: string;
  keys: Key[];
}

// 匹配路由
interface MatchedRoute {
  type: string;
  url: string;
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

// 定义系统路由规则
const routeRegex = [
  "/page-:id", // 页面
  "/article-:id", // 文章
  "/category/:id", // 分类
  "/search/:keywords", // 搜索
  "/tag/:id" // 标签
];

// 定义示例数据格式
const demoRoutes = [
  {
    regexp: "about",
    type: "alias",
    url: "/page-1"
  },
  {
    regexp: "news",
    type: "alias",
    url: "/category/1"
  },
  {
    regexp: "news/:id",
    type: "alias",
    url: "/article-:id?categoryId=1"
  },
  {
    regexp: "test",
    type: "alias",
    url: "/article-8"
  }
];

const matchRoute = (path: string, routeMatchers: RouteMatcher[]): MatchedRoute | null => {
  for (const route of routeMatchers) {
    // 匹配当前访问路由是否存在系统路由中
    const match = route.regexp.exec(path);
    if (match) {
      const params: { [key: string]: string } = {};
      route.keys.forEach((key, index) => {
        params[key.name] = match[index + 1];
      });
      return { type: route.type, url: route.url, params };
    }
  }
  return null;
};

// 判断路由是否在系统路由中
const isMatchedInRouteRegex = (path: string = ""): any => {
  if (!path) {
    return false;
  }

  for (const pattern of routeRegex) {
    const keys: Key[] = [];
    const re = pathToRegexp(pattern, keys);
    const match = re.exec(path);
    if (match) {
      const params: { [key: string]: string } = {};
      keys.forEach((key, index) => {
        params[key.name] = match[index + 1];
      });
      return { type: pattern, params };
    }
  }
  return false;
};

export default async function Page(props: Props) {
  const { slug } = props.params;
  const currentPath = slug.join("/");
  const routeMatchers: RouteMatcher[] = demoRoutes.map((route) => {
    const keys: Key[] = [];
    const regexp: RegExp = pathToRegexp(route.regexp, keys);
    return { regexp, type: route.type, url: route.url, keys };
  });
  const matchedRoute = matchRoute(currentPath, routeMatchers);
  let matched: any = false;
  if (matchedRoute) {
    matched = isMatchedInRouteRegex(matchedRoute?.url);
  } else {
    matched = isMatchedInRouteRegex("/" + currentPath);
  }
  let schema = {};
  if (matched) {
    // 根据pageId获取schema
    const { params = {} } = matched;
    switch (matched.type) {
      case routeRegex[0]: // 页面
        if (!params?.id) {
          notFound();
        }
        const pageRes = await getPage(params.id);
        if (pageRes.code === 0) {
          notFound();
        }
        schema = pageRes.data.schema;
        break;
      case routeRegex[1]:
        if (!params?.id) {
          notFound();
        }
        const articleRes: any = await getArticle(params.id);
        if (articleRes.code === 0) {
          notFound();
        }
        const articleState:any = {};
        for (const key in articleRes?.data) {
          if (articleRes.data.hasOwnProperty(key)) {
            const value = articleRes.data[key];
            articleState[key] = {
              type: 'JSExpression',
              value: JSON.stringify(value)
            }
          }
        }
        // 获取文章模板
        articleSchema.state = {...articleSchema.state, ...articleState }
        schema = articleSchema;
        break;
      default:
        break;
    }
  } else {
    notFound();
  }
  return <ReactRender schema={schema} />;
}
