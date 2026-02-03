'use client';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { showNotification } from '@/helpers/messages-helper';
import { Link } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {};

export default function CopyLink({}: Props) {
    const messages = useTranslations();
    const currentURL =
        typeof window === 'undefined' ? '' : window.location.href;
    const handleCopyLink = () => {
        navigator.clipboard.writeText(currentURL).then(() => {
            showNotification('info', messages('common.copied'));
        });
    };
    return (
        <CustomTooltip placement="right" title={''}>
            <IconButton
                className="size-8 rounded-full border"
                onClick={handleCopyLink}
            >
                <Link size={SIZE_ICON} />
            </IconButton>
        </CustomTooltip>
    );
}
