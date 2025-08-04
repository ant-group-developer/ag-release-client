import { Layout, theme } from 'antd';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const { Content } = Layout;

function ContentComponent({ children }: Props) {
    const { token } = theme.useToken();
    return (
        <Content>
            <div
                style={{ backgroundColor: token.colorBgContainer }}
                className="h-[calc(100vh-4rem)] overflow-auto"
            >
                {children}
            </div>
        </Content>
    );
}

export default ContentComponent;
