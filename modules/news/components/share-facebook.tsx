'use client';

import { useEffect, useState } from 'react';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { Facebook } from 'lucide-react';

type Props = {};

export default function ShareFacebook({}: Props) {
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setShareUrl(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`
            );
        }
    }, []);

    return (
        <CustomTooltip placement="right" title={''}>
            <a
                href={shareUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                    if (!shareUrl) {
                        e.preventDefault();
                    }
                }}
            >
                <IconButton className="size-8 h-8 w-8 rounded-full border">
                    <Facebook size={SIZE_ICON} />
                </IconButton>
            </a>
        </CustomTooltip>
    );
}
