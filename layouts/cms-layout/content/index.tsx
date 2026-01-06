import { Layout, theme } from 'antd';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const { Content } = Layout;

function ContentComponent({ children }: Props) {
    // const { token } = theme.useToken();
    return (
        <Content>
            <div
                className="h-[calc(100vh-64px)] overflow-y-auto"
            >
                {children}
            </div>
        </Content>
    );
}

export default ContentComponent;
