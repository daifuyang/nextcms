import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";

export default function MyDropdown(props: any) {
  const { disabled, buttonIconClassName, buttonLabel, menu } = props
  return (
    <Dropdown getPopupContainer={ node => {
      if(node) {
        return node.parentNode;
      }
      return document.body;
    } } menu={menu}>
      <button disabled={disabled} className="toolbar-item block-controls" type="button">
        {buttonIconClassName && <span className={buttonIconClassName} />}
        {buttonLabel && (
          <span className="text dropdown-button-text">{buttonLabel}</span>
        )}
        <DownOutlined />
      </button>
    </Dropdown>
  );
}
