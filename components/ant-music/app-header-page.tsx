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
            <div className={'flex gap-4'}>
                <div>
                    <Image
                        className={cn('!aspect-square !rounded-lg', {
                            '!size-14 transition-all duration-300': isScrolled,
                        })}
                        preview={{
                            maskClassName: cn('rounded-lg'),
                        }}
                        width={isScrolled ? 56 : 110}
                        height={isScrolled ? 56 : 110}
                        src={`${imageSrc ? imageSrc : `https://picsum.photos/seed/300/300`} `}
                        alt=""
                    />
                </div>
                <div
                    className={cn('grid grid-cols-2 gap-x-8', {
                        'grid-cols-3': isScrolled,
                    })}
                >
                    {children}
                </div>
            </div>
            <div>{options}</div>
        </div>
    );
}
