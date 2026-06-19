import { ReleasesData } from '@/modules/releases/types';
import { Button, Card, List, theme, Typography } from 'antd';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    releaseData: ReleasesData;
};

export default function PlatformLinksSection({ releaseData }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    if (!releaseData) return null;

    const externalLinks: { name: string; url: string }[] = [];
    if (releaseData.metadataExternal?.spotify?.albumUrl) {
        externalLinks.push({
            name: 'Spotify',
            url: releaseData.metadataExternal.spotify.albumUrl,
        });
    }

    return (
        <Card
            title={
                <span className="text-base font-semibold">
                    {messages('release.overview.platformLinks')}
                </span>
            }
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            styles={{
                body: {
                    padding: '24px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <List
                dataSource={externalLinks}
                renderItem={(item) => (
                    <List.Item className="border-none !px-0 !py-2">
                        <div
                            className="flex w-full items-center justify-between rounded-xl border p-4 transition-all duration-300 hover:shadow-md"
                            style={{
                                backgroundColor: token.colorBgContainer,
                                borderColor: token.colorBorderSecondary,
                            }}
                        >
                            <div className="mr-4 min-w-0">
                                <Typography.Text
                                    strong
                                    className="block text-[14px]"
                                >
                                    {item.name}
                                </Typography.Text>
                                <Typography.Text
                                    type="secondary"
                                    className="block max-w-[500px] truncate text-[12px]"
                                >
                                    {item.url}
                                </Typography.Text>
                            </div>
                            <Button
                                type="default"
                                size="middle"
                                shape="round"
                                icon={
                                    <ExternalLink
                                        size={14}
                                        className="mt-0.5"
                                    />
                                }
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center"
                            >
                                {messages('common.listen')}
                            </Button>
                        </div>
                    </List.Item>
                )}
                locale={{
                    emptyText: messages('common.noDataAvailable'),
                }}
            />
        </Card>
    );
}
