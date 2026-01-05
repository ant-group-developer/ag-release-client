'use client';
import { cn } from '@/helpers/common';
import { Image, Skeleton, theme } from 'antd';
import { ReactNode } from 'react';

type Props = {
    className?: string;
    children: ReactNode;
    imageSrc: string;
    imageLoading?: boolean;
    isScrolled: boolean;
    options?: ReactNode;
};

export default function AppHeaderPage({
    className,
    children,
    imageSrc,
    imageLoading,
    isScrolled = false,
    options,
}: Props) {
    const { token } = theme.useToken();
    const size = isScrolled ? 64 : 110;
    return (
        <div
            className={cn('mt-3 flex justify-between', className)}
            style={{
                backgroundColor: token.colorBgContainer,
            }}
        >
            <div className={'flex items-start gap-4'}>
                <div
                    className={cn(
                        'overflow-hidden rounded-lg',
                        'transition-[width,height] duration-300 ease-out',
                        isScrolled ? 'size-16' : 'size-28'
                    )}
                >
                    {imageLoading ? (
                        <Skeleton.Image
                            active
                            style={{
                                width: size,
                                height: size,
                                borderRadius: 8,
                            }}
                        />
                    ) : (
                        <Image
                            className="!aspect-square h-full w-full !rounded-lg object-cover"
                            preview={{
                                maskClassName: 'rounded-lg',
                            }}
                            fallback="/image/fallback-image.png"
                            src={imageSrc}
                            alt=""
                        />
                    )}
                </div>
                <div
                    className={cn(
                        'flex flex-col flex-wrap content-start gap-x-8 gap-y-2'
                    )}
                    style={{ height: isScrolled ? 64 : 110 }}
                >
                    {children}
                </div>
            </div>
            <div>{options}</div>
        </div>
    );
}
