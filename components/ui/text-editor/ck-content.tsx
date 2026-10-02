'use client';

import { cn } from '@/helpers/common';
import { Image } from 'antd';
import { useState } from 'react';

type Props = {
    value: string | TrustedHTML;
    className?: string;
    enableImagePreview?: boolean;
};

function CKContent({ value, className, enableImagePreview = true }: Props) {
    const [previewImages, setPreviewImages] = useState<string[]>([]);
    const [previewIndex, setPreviewIndex] = useState(0);
    const [previewKey, setPreviewKey] = useState(0);
    const [previewVisible, setPreviewVisible] = useState(false);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!enableImagePreview) return;

        const target = e.target as HTMLElement;
        if (target.tagName.toLowerCase() === 'img') {
            const clickedSrc = target.getAttribute('src');
            if (clickedSrc) {
                const container = e.currentTarget;
                const imgElements = Array.from(
                    container.querySelectorAll('img')
                );
                const imageSources = imgElements
                    .map((img) => img.getAttribute('src'))
                    .filter(Boolean) as string[];

                const index = imageSources.indexOf(clickedSrc);
                setPreviewIndex(index !== -1 ? index : 0);
                setPreviewImages(
                    imageSources.length > 0 ? imageSources : [clickedSrc]
                );
                setPreviewKey((prev) => prev + 1);
                setPreviewVisible(true);
            }
        }
    };

    return (
        <>
            <div
                className={cn(
                    'ck-content !min-h-[auto] p-0',
                    enableImagePreview &&
                        '[&_img]:cursor-zoom-in [&_img]:transition-opacity [&_img:hover]:opacity-90',
                    className
                )}
                onClick={handleClick}
                dangerouslySetInnerHTML={{ __html: value }}
            />

            {enableImagePreview && previewImages.length > 0 && (
                <div style={{ display: 'none' }}>
                    <Image.PreviewGroup
                        key={previewKey}
                        preview={{
                            visible: previewVisible,
                            onVisibleChange: (visible) =>
                                setPreviewVisible(visible),
                            current: previewIndex,
                            onChange: (current) => setPreviewIndex(current),
                        }}
                        items={previewImages}
                    />
                </div>
            )}
        </>
    );
}

export default CKContent;

