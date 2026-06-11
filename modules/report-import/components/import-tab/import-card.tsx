import React from 'react';
import { Button, theme } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';

interface ImportCardProps {
    onOpenModal: () => void;
}

export const ImportCard: React.FC<ImportCardProps> = ({ onOpenModal }) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <div
            style={{
                maxWidth: 640,
                margin: '48px auto',
                padding: '48px 32px',
                textAlign: 'center',
                backgroundColor: token.colorBgContainer,
                borderRadius: token.borderRadiusLG * 1.5,
                border: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
            }}
        >
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 96,
                    height: 96,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${token.colorPrimaryBg} 0%, ${token.colorPrimaryBgHover} 100%)`,
                    color: token.colorPrimary,
                    fontSize: 40,
                    marginBottom: 24,
                }}
            >
                <CloudUploadOutlined />
            </div>

            <h2
                style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: token.colorText,
                }}
            >
                {messages('reportConfigs.importReport')}
            </h2>

            <p
                style={{
                    fontSize: 14,
                    color: token.colorTextDescription,
                    maxWidth: 420,
                    margin: '12px auto 32px',
                    lineHeight: '1.6',
                }}
            >
                {messages('reportConfigs.dragDropHint')}
            </p>

            <Button
                type="primary"
                size="large"
                icon={<CloudUploadOutlined />}
                onClick={onOpenModal}
                style={{
                    padding: '0 32px',
                    height: 48,
                    borderRadius: 24,
                    fontWeight: 600,
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)',
                }}
            >
                {messages('reportConfigs.importReportBtn')}
            </Button>
        </div>
    );
};
