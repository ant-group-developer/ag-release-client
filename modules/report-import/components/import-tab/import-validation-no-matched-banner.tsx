import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { PreValidateImportResponse } from '../../types/payload';

interface ImportValidationNoMatchedBannerProps {
    validationResult: PreValidateImportResponse;
}

export const ImportValidationNoMatchedBanner: React.FC<ImportValidationNoMatchedBannerProps> = ({
    validationResult,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    if (validationResult.matched && validationResult.matched.length > 0) {
        return null;
    }

    return (
        <div
            className="p-4"
            style={{
                borderRadius: token.borderRadiusLG,
                backgroundColor: token.colorWarningBg,
                border: `1px solid ${token.colorWarningBorder}`,
            }}
        >
            <div
                className="font-semibold"
                style={{
                    color: token.colorWarningText,
                }}
            >
                {messages('reportConfigs.importResult.noValidFiles')}
            </div>
        </div>
    );
};
