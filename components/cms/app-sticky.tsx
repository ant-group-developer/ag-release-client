import { cn } from '@/helpers/common';
import { theme } from 'antd';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren & {
    className?: string;
};

function AppSticky({ className, children }: Props) {
    const { token } = theme.useToken();
    return (
        <div
            id="app-header-sticky"
            className={cn('sticky top-0 z-10', className)}
            style={{
                background: token.colorBgContainer,
            }}
        >
            {children}
        </div>
    );
}

export default AppSticky;
