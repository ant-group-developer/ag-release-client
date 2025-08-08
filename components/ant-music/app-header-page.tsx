'use client';
import { cn } from '@/helpers/common';
import { Image, theme } from 'antd';
import { ReactNode } from 'react';

type Props = {
    className?: string;
    children: ReactNode;
    imageSrc: string;
    isScrolled: boolean;
    options?: ReactNode;
};

export default function AppHeaderPage({
    className,
    children,
    imageSrc,
    isScrolled = false,
    options,
}: Props) {
    const { token } = theme.useToken();

    return (
        <div
            className={cn('flex justify-between px-4 py-2', className)}
            style={{
                backgroundColor: token.colorBgContainer,
            }}
        >
            <div className={'flex items-start gap-4'}>
                <div>
                    <Image
                        className={cn(
                            '!aspect-square !rounded-lg object-cover transition-all ease-out'
                            // {
                            //     'transition-all duration-700 ease-out':
                            //         isScrolled,
                            // }
                        )}
                        preview={{
                            maskClassName: cn('rounded-lg'),
                        }}
                        fallback={'/image/fallback-image.png'}
                        width={isScrolled ? 56 : 110}
                        height={isScrolled ? 56 : 110}
                        src={imageSrc}
                        alt=""
                    />
                </div>
                <div
                    className={cn(
                        'flex flex-col flex-wrap content-start gap-x-8 gap-y-2'
                    )}
                    style={{ height: isScrolled ? 56 : 110 }}
                >
                    {children}
                </div>
            </div>
            <div>{options}</div>
        </div>
    );
}
