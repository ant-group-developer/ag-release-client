import { SIZE_ICON } from '@/constants/common';
import { cn, isValidUrl } from '@/helpers/common';
import { Input, Tooltip } from 'antd';
import { Copy, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import IconButton from '../button/icon-button';

type Props = {
    url: string;
    className?: string;
};

export default function ClipBoard({ url, className }: Props) {
    const [copied, setCopied] = useState(false);
    const messages = useTranslations();

    const isUrlValid = isValidUrl(url);

    const handleCopy = () => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                setCopied(true);
                // Reset copied state after 2 seconds
                setTimeout(() => {
                    setCopied(false);
                }, 4000);
            })
            .catch((err) => {
                console.error('Failed to copy text: ', err);
            });
    };

    const handleClick = () => {
        window.open(url, '_blank');
    };

    return (
        <div className={cn('flex w-full gap-1', className)}>
            <Input className="flex-grow" value={url} readOnly />
            <Tooltip
                className="cursor-pointer"
                title={
                    copied ? messages('common.copied') : messages('common.copy')
                }
            >
                <IconButton
                    onClick={handleCopy}
                    className="rounded-md bg-blue-500 text-white hover:bg-blue-400"
                >
                    <Copy size={SIZE_ICON} />
                </IconButton>
            </Tooltip>
            {isUrlValid && (
                <Tooltip
                    title={messages('message.openNewTab')}
                    className="rounded-md bg-blue-500 text-white hover:bg-blue-400"
                >
                    <IconButton onClick={handleClick}>
                        <ExternalLink size={SIZE_ICON} />
                    </IconButton>
                </Tooltip>
            )}
        </div>
    );
}
