import { Layout } from 'antd';
import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
};

const { Content } = Layout;

function ContentComponent({ children }: Props) {
    return (
        <Content>
            <div className="h-[calc(100vh-4rem)] overflow-auto">{children}</div>
        </Content>
    );
}

export default ContentComponent;
