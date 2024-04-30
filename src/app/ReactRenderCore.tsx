'use client'

import * as components from "web-material";
import { ConfigProvider } from "web-material";
import Link from 'next/link'

import "web-material/dist/webMaterial.css";

import ReactRender from "@zerocmf/lowcode-react-renderer/src";
import { createAxiosFetchHandler, request } from "@/utils/request";
import { useEffect } from "react";

export default function ReactRenderCore(props: any) {
  const { schema = {} } = props;
  // Promise.all(promises)
  // .then(results => {
  //   console.log('所有请求完成', results);
  //   // 处理每个请求的结果
  // })
  // .catch(error => {
  //   console.error('至少有一个请求失败', error);
  // });

  return (
    <ConfigProvider as={{ a: Link }}>
      <ReactRender schema={schema} components={components} appHelper={{
        requestHandlersMap: {
          // editor: createAxiosFetchHandler()
        }
      }} />
    </ConfigProvider>
  );
}