'use client'

import * as components from "web-material";
import { ConfigProvider } from "web-material";
import Link from 'next/link'

import "web-material/dist/webMaterial.css";

import ReactRender from "@zerocmf/lowcode-react-renderer/src";
export default function ReactRenderCore(props: any) {
  const { schema = {} } = props;
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