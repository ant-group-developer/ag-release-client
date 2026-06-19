import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { PreValidateImportResponse } from '../../types/payload';

interface ImportValidationInvalidListProps {
    validationResult: PreValidateImportResponse;
    isSideBySide: boolean;
}

export const ImportValidationInvalidList: React.FC<ImportValidationInvalidListProps> = ({
    validationResult,
    isSideBySide,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    if (!(validationResult.invalid?.length > 0)) {
        return null;
    }

    return (
        <div>
            <h4
                className="mb-2 font-semibold"
                style={{
                    color: token.colorError,
                }}
            >
                {messages('reportConfigs.importResult.invalidFiles', { count: validationResult.invalid.length })}
            </h4>
            <div
                className="px-4 py-2 flex flex-col"
                style={{
                    maxHeight: isSideBySide ? 300 : 240,
                    overflowY: 'auto',
                    border: `1px solid ${token.colorBorderSecondary}`,
                    borderRadius: token.borderRadiusLG,
                    backgroundColor: token.colorBgLayout,
                }}
            >
                {validationResult.invalid.map((item: any, idx: number) => (
                    <div
                        key={idx}
                        className="py-2 flex flex-col gap-0.5"
                        style={{
                            borderBottom:
                                idx < validationResult.invalid.length - 1
                                    ? `1px solid ${token.colorBorderSecondary}`
                                    : 'none',
                        }}
                    >
                        <span
                            className="text-[13px] font-medium"
                            style={{
                                color: token.colorText,
                            }}
                        >
                            {item.path}
                        </span>
                        <span
                            className="text-xs"
                            style={{
                                color: token.colorError,
                            }}
                        >
                            {item.reason}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
