import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

interface ImportJobErrorDisplayProps {
    error: string | null;
}

export const ImportJobErrorDisplay: React.FC<ImportJobErrorDisplayProps> = ({
    error,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    if (!error) return null;

    return (
        <div
            className="p-3 text-[13px]"
            style={{
                borderRadius: token.borderRadius,
                backgroundColor: token.colorErrorBg,
                border: `1px solid ${token.colorErrorBorder}`,
                color: token.colorErrorText,
            }}
        >
            <strong>
                {messages('reportConfigs.importResult.errorDetails')}:
            </strong>{' '}
            {error}
        </div>
    );
};
