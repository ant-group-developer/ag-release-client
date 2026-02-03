import AppCard from '@/components/ant-music/app-card';
import { cn } from '@/helpers/common';
import { ArtistData } from '@/modules/artist/types';
import { Empty, theme } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

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
    return (
        <AppCard
            title={messages('artist.profiles')}
            style={{ backgroundColor: token.colorBgContainer, border: 'none' }}
        >
            <div
                className={cn(
                    'flex gap-2 overflow-y-auto rounded-md px-4 pb-4'
                )}
            >
                {artistProfiles?.map((item, index) => {
                    return (
                        <>
                            <div
                                key={item?.id}
                                className={cn(
                                    'cursor-pointer items-center justify-between rounded-lg !bg-zinc-100 px-24 py-8 hover:!bg-zinc-200'
                                )}
                                onClick={() => handleOpenLink(item?.url)}
                            >
                                <div className="">
                                    <Image
                                        className="rounded-full"
                                        src={item?.dsp?.picture ?? ''}
                                        alt={item?.dsp?.name || ''}
                                        width={40}
                                        height={40}
                                    />
                                </div>
                            </div>
                        </>
                    );
                })}

                {artistProfiles && artistProfiles?.length <= 0 && (
                    <div className="flex flex-1 justify-center">
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}
            </div>
        </AppCard>
    );
}
