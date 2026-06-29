import { Button, Typography, theme } from 'antd';
import { useTranslations } from 'next-intl';

interface CustomDomainAutoSetupProps {
    onConnectCloudflare: () => void;
    isFetchingOAuthUrl: boolean;
}

export default function CustomDomainAutoSetup({
    onConnectCloudflare,
    isFetchingOAuthUrl,
}: CustomDomainAutoSetupProps) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <div
            className="mb-4 mt-6 rounded-xl p-6"
            style={{
                backgroundColor: token.colorInfoBg,
                borderColor: token.colorInfoBorder,
                borderWidth: '1px',
                borderStyle: 'solid',
            }}
        >
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <Typography.Title
                        level={5}
                        style={{ margin: '0 0 8px 0' }}
                        className="flex items-center gap-2"
                    >
                        {messages('tenant.customDomain.autoSetup.title')}
                    </Typography.Title>
                    <Typography.Text
                        type="secondary"
                        className="block max-w-2xl text-sm"
                    >
                        {messages('tenant.customDomain.autoSetup.description')}
                    </Typography.Text>
                </div>
                <Button
                    type="primary"
                    onClick={onConnectCloudflare}
                    loading={isFetchingOAuthUrl}
                >
                    {messages('tenant.customDomain.autoSetup.button')}
                </Button>
            </div>
        </div>
    );
}
