import { cn } from '@/helpers/common';
import { Image, Tabs, TabsProps, theme } from 'antd';
import { ReactNode } from 'react';

type Props = {
    className?: string;
    children: ReactNode;
    imageSrc: string;
    itemTabs: TabsProps['items'] | undefined;
};

export default function AppHeaderPage({
    className,
    children,
    imageSrc,
    itemTabs,
}: Props) {
    const { token } = theme.useToken();

    return (
        <div>
            <div className={cn('flex gap-4 px-4 py-2', className)}>
                <div>
                    <Image
                        className="!aspect-square !rounded-lg"
                        preview={{
                            maskClassName: 'rounded-lg',
                        }}
                        width={110}
                        height={110}
                        src={`${imageSrc ? imageSrc : `https://picsum.photos/seed/300/300`} `}
                        alt=""
                    />
                </div>
                <div
                    className={cn('grid grid-cols-2 gap-x-8 gap-y-4', {
                        // 'grid-cols-3': isScrolled,
                    })}
                >
                    {children}
                </div>
            </div>
            <div className="px-4">
                <Tabs
                    className="!pt-0"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    items={itemTabs}
                />
            </div>
        </div>
    );
}
