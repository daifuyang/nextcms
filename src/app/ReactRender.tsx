'use client'

import * as components from "web-material";
import "web-material/dist/webMaterial.css";

import ReactRender from "@zerocmf/lowcode-react-renderer/src";
export default function Render(props: any) {
  const { schema } = props;
  return (
    <>
      <ReactRender schema={schema} components={components} />
    </>
  );
}
