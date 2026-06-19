import { CopyOutlined } from '@ant-design/icons';
import { Tooltip, Typography, message } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

const { Text } = Typography;

type InfoRowProps = {
    label: string;
    value: React.ReactNode;
    copyText?: string;
};

export default function InfoRow({ label, value, copyText }: InfoRowProps) {
    const messages = useTranslations();

    const handleCopy = () => {
        if (!copyText) return;
        navigator.clipboard.writeText(copyText);
        message.success(`${messages('common.copied')} ${label}!`);
    };

    return (
        <div className="flex items-center justify-between border-[#f0f0f0] py-3">
            <div className="flex-[0_0_200px] pr-4">
                <Text type="secondary" className="text-[14px]">
                    {label}
                </Text>
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between border-b border-[#f0f0f0]">
                <div className="truncate">{value}</div>
                {copyText && (
                    <Tooltip title={messages('common.copy')}>
                        <CopyOutlined
                            className="ml-4 cursor-pointer text-[14px] text-gray-400 transition-colors hover:text-gray-600"
                            onClick={handleCopy}
                        />
                    </Tooltip>
                )}
            </div>
        </div>
    );
}
