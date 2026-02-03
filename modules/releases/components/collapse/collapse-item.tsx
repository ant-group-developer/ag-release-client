import { CaretRightOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Collapse, theme } from 'antd';
import React from 'react';

interface Props extends CollapseProps {}

export const CollapseItem = ({ items, ...props }: Props) => {
    const { token } = theme.useToken();

    const panelStyle: React.CSSProperties = {
        // background: token.colorFillAlter,
        background: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };

    const styledItems =
        items?.map((item) => ({
            ...item,
            style: item.style || panelStyle,
        })) || [];

    return (
        <Collapse
            {...props}
            bordered={false}
            className="custom-collapse"
            expandIcon={({ isActive }) => (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        minHeight: '1.5em',
                    }}
                >
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                </div>
            )}
            style={{ background: token.colorBgContainer }}
            items={styledItems}
        />
    );
};
