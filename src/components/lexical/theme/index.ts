/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import "./default.css";

const theme = {
  code: "editor-code",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5"
  },
  image: "editor-image",
  link: "editor-link",
  list: {
    checklist: "editor-checklist",
    listitem: "editor-listitem",
    listitemChecked: "editor-listitem-checked",
    listitemUnchecked: "editor-listitem-unchecked",
    nested: {
      listitem: "editor-nested-listitem"
    },
    olDepth: [
      "editor-list-ol1",
      "editor-list-ol2",
      "editor-list-ol3",
      "editor-list-ol4",
      "editor-list-ol5"
    ],
    ul: "editor-list-ul"
  },
  ltr: "ltr",
  paragraph: "editor-paragraph",
  placeholder: "editor-placeholder",
  quote: "editor-quote",
  rtl: "rtl",
  table: 'editor-table',
  tableAddColumns: 'editor-tableAddColumns',
  tableAddRows: 'editor-tableAddRows',
  tableCell: 'editor-tableCell',
  tableCellActionButton: 'editor-tableCellActionButton',
  tableCellActionButtonContainer:
    'editor-tableCellActionButtonContainer',
  tableCellEditing: 'editor-tableCellEditing',
  tableCellHeader: 'editor-tableCellHeader',
  tableCellPrimarySelected: 'editor-tableCellPrimarySelected',
  tableCellResizer: 'editor-tableCellResizer',
  tableCellSelected: 'editor-tableCellSelected',
  tableCellSortedIndicator: 'editor-tableCellSortedIndicator',
  tableResizeRuler: 'editor-tableCellResizeRuler',
  tableSelected: 'editor-tableSelected',
  tableSelection: 'editor-tableSelection',
  text: {
    bold: "editor-text-bold",
    code: "editor-text-code",
    hashtag: "editor-text-hashtag",
    italic: "editor-text-italic",
    overflowed: "editor-text-overflowed",
    strikethrough: "editor-text-strikethrough",
    underline: "editor-text-underline",
    underlineStrikethrough: "editor-text-underline-strikethrough"
  }
};

export default theme;
