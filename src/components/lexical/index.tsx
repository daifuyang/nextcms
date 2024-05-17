/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SharedHistoryContext, useSharedHistoryContext } from "./context/SharedHistoryContext";

import { OnChangePlugin } from "./plugins/OnChangePlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import * as React from "react";

import Theme from "./theme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

import "./styles.css";

import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import Nodes from "./nodes";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import PageBreakPlugin from "./plugins/PageBreakPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import ImagesPlugin from "./plugins/ImagesPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import TableCellActionMenuPlugin from "./plugins/TableActionMenuPlugin";
import { CAN_USE_DOM } from "./shared/canUseDOM";
import FloatingLinkEditorPlugin from "./plugins/FloatingLinkEditorPlugin";
import FloatingTextFormatToolbarPlugin from "./plugins/FloatingTextFormatToolbarPlugin";
import CodeActionMenuPlugin from "./plugins/CodeActionMenuPlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { InitialStatePlugin } from "./plugins/InitialStatePlugin";

function Placeholder() {
  return <div className="editor-placeholder">请输入文本内容</div>;
}

const editorConfig = {
  namespace: "editor",
  nodes: [...Nodes],
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: Theme
};

interface Props {
  value?: string;
  onChange?: (html: string) => void;
}

export default function App(props: Props) {
  const { value, onChange } = props;
  const { historyState } = useSharedHistoryContext();
  const [floatingAnchorElem, setFloatingAnchorElem] = React.useState<HTMLDivElement | null>(null);

  const [isSmallWidthViewport, setIsSmallWidthViewport] = React.useState<boolean>(false);

  const [isLinkEditMode, setIsLinkEditMode] = React.useState<boolean>(false);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  React.useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia("(max-width: 1025px)").matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener("resize", updateViewPortWidth);

    return () => {
      window.removeEventListener("resize", updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <SharedHistoryContext>
        <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
        <div className="editor-container">
          {/* <AutoFocusPlugin /> */}
          <ClearEditorPlugin />
          <HashtagPlugin />
          <AutoLinkPlugin />

          <HistoryPlugin externalHistoryState={historyState} />

          <RichTextPlugin
            contentEditable={
              <div className="editor-scroller">
                <div className="editor" ref={onRef}>
                  <ContentEditable className="contentEditable" />
                </div>
              </div>
            }
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <MarkdownShortcutPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <CheckListPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <TablePlugin hasCellMerge={true} hasCellBackgroundColor={true} />
          <TableCellResizer />
          <ImagesPlugin />
          <LinkPlugin />
          <HorizontalRulePlugin />
          <PageBreakPlugin />
          <InitialStatePlugin initialValue={value} />
          <OnChangePlugin
            onChange={(editorState, editor) => {
              // 获取html
              const htmlString = editorState.read(() => $generateHtmlFromNodes(editor));
              if (onChange) {
                onChange(htmlString);
              }
            }}
          />
          {floatingAnchorElem && !isSmallWidthViewport && (
            <>
              <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
              <FloatingLinkEditorPlugin
                anchorElem={floatingAnchorElem}
                isLinkEditMode={isLinkEditMode}
                setIsLinkEditMode={setIsLinkEditMode}
              />
              <TableCellActionMenuPlugin anchorElem={floatingAnchorElem} cellMerge={true} />
              <FloatingTextFormatToolbarPlugin
                anchorElem={floatingAnchorElem}
                setIsLinkEditMode={setIsLinkEditMode}
              />
            </>
          )}
        </div>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}
