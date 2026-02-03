import { theme } from 'antd';

export default function AppPageWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { token } = theme.useToken();
    return (
        <div
            // className="min-h-[calc(100vh-64px)]"
            style={{ backgroundColor: token.colorBgLayout }}
        >
            {children}
        </div>
    );
}
