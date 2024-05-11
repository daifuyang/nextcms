"use client";

import * as components from "web-material";
import { ConfigProvider } from "web-material";
import Link from "next/link";

import "web-material/dist/webMaterial.css";

import ReactRender from "@zerocmf/lowcode-react-renderer/src";
import { useServerInsertedHTML } from "next/navigation";
export default function ReactRenderCore(props: any) {
  const { schema = {} } = props;

  useServerInsertedHTML(() => {
    return (
      schema?.css && (
        <>
          <style type="text/css" dangerouslySetInnerHTML={{ __html: schema.css }}></style>
        </>
      )
    );
  });

  return (
    <ConfigProvider as={{ a: Link }}>
      <ReactRender
        schema={{ ...schema, css: undefined }}
        components={components}
        appHelper={{
          requestHandlersMap: {
            // editor: createAxiosFetchHandler()
          }
        }}
      />
    </ConfigProvider>
  );
}
