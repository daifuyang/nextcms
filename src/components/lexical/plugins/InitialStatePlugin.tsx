/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { $getRoot, $insertNodes, $setSelection } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLayoutEffect } from "react";
import { $restoreEditorState } from "@lexical/utils";

export function InitialStatePlugin({
  initialValue = null
}: {
  initialValue?: string | null;
}): null {
  const [editor] = useLexicalComposerContext();

  useLayoutEffect(() => {
    if (editor && initialValue) {
      editor.update(() => {
        $restoreEditorState(editor, editor.getEditorState().clone(null));
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialValue, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom);
        $insertNodes(nodes);
        $setSelection(null);
      });
    }
  }, []);

  return null;
}
