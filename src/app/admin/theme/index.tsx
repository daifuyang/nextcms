"use client";

import React from "react";
import { ConfigProvider } from "antd";

const withTheme = (node: JSX.Element) => (
    <>
        <ConfigProvider
            theme={{
                components: {
                    Layout: {
                        siderBg: "#ffffff",
                        headerBg: "#001529",
                        triggerBg: '#ffffff',
                        triggerColor: '#001529',
                    },
                    Menu: {
                        itemMarginBlock: 0,
                        itemMarginInline: 0,
                        itemBorderRadius: 0,
                    }
                }
            }}
        >
            {node}
        </ConfigProvider>
    </>
)

export default withTheme;