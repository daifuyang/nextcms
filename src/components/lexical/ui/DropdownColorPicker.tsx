/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DownOutlined } from '@ant-design/icons';
import { ColorPicker } from 'antd';
import * as React from 'react';

type Props = {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
};

export default function DropdownColorPicker({
  disabled = false,
  stopCloseOnClickSelf = true,
  color,
  onChange,
  buttonClassName,
  buttonIconClassName,
  buttonLabel
}: Props) {

  return (
    <ColorPicker value={color} onChange={(value, hex: string) => {
      if (onChange) {
        onChange(hex, false);
      }
    }}>
      <button
        type="button"
        disabled={disabled}
        className={buttonClassName}>
        {buttonIconClassName && <span className={buttonIconClassName} />}
        {buttonLabel && (
          <span className="text dropdown-button-text">{buttonLabel}</span>
        )}
        <DownOutlined />
      </button>
    </ColorPicker>
  )
}
