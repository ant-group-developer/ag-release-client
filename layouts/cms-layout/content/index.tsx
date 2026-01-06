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
                className="h-full"
            >
                {children}
            </div>
        </Content>
    );
}

export default ContentComponent;
