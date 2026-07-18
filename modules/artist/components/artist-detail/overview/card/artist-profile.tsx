import AppCard from '@/components/ant-music/app-card';
import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';
import { cn } from '@/helpers/common';
import { ArtistData } from '@/modules/artist/types';
import { Empty, Typography, theme } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    artistData: ArtistData;
};

export default function ArtistProfileCard({ artistData }: Props) {
    const messages = useTranslations();
    const artistProfiles = artistData?.artistProfiles;
    const { token } = theme.useToken();
    const handleOpenLink = (link: string) => {
        if (!link) return;
        window.open(link, '_blank');
    };

    if (!artistProfiles || artistProfiles?.length === 0) return null;

    return (
        <AppCard
            title={messages('artist.profiles')}
            style={{ backgroundColor: token.colorBgContainer, border: 'none' }}
        >
            <div
                className={cn(
                    'flex flex-col gap-4 overflow-y-auto rounded-md px-4 pb-4'
                )}
            >
                <div className="flex gap-2 overflow-x-auto">
                    {artistProfiles?.map((item) => {
                        return (
                            <div
                                key={item?.id}
                                className={cn(
                                    'flex min-w-56 cursor-pointer items-center gap-3 rounded-lg !bg-zinc-100 p-4 hover:!bg-zinc-200'
                                )}
                                onClick={() => handleOpenLink(item?.url)}
                            >
                                <ImageFallback
                                    className="rounded-full"
                                    fallbackSrc={FALLBACK_IMAGE}
                                    src={item?.dsp?.picture ?? ''}
                                    alt={item?.dsp?.name || ''}
                                    width={40}
                                    height={40}
                                />
                                <div className="min-w-0">
                                    <Typography.Text
                                        strong
                                        className="block truncate"
                                    >
                                        {item?.name || artistData?.name}
                                    </Typography.Text>
                                    <Typography.Text
                                        type="secondary"
                                        className="block truncate"
                                    >
                                        {item?.dsp?.name}
                                    </Typography.Text>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {artistProfiles && artistProfiles?.length <= 0 && (
                    <div className="flex flex-1 justify-center">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}
            </div>
        </AppCard>
    );
}
