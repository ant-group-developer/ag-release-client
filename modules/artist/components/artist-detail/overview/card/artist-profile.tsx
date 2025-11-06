import AppCard from '@/components/ant-music/app-card';
import { cn } from '@/helpers/common';
import { ArtistData } from '@/modules/artist/types';
import { Button, theme } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = {
    artistData: ArtistData;
};

export default function ArtistProfileCard({ artistData }: Props) {
    const messages = useTranslations();
    const artistProfiles = artistData?.artistProfiles;
    const { token } = theme.useToken();
    return (
        <AppCard
            title={messages('artist.profiles')}
            style={{ backgroundColor: token.colorBgContainer, border: 'none' }}
        >
            <div
                className={cn(
                    'flex max-h-[245px] flex-col overflow-y-auto rounded-md'
                )}
            >
                {artistProfiles?.map((item, index) => {
                    return (
                        <>
                            <div
                                key={item?.id}
                                className={cn(
                                    'flex cursor-pointer items-center justify-between p-3'
                                    // linked
                                    //     ? 'bg-green-500 text-white hover:bg-green-500'
                                    //     : 'bg-gray-100'
                                )}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        token.colorFillAlter;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor =
                                        token.colorBgContainer;
                                }}
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        className="rounded-full"
                                        src={item?.dsp?.picture ?? ''}
                                        alt={item?.dsp?.name || ''}
                                        width={32}
                                        height={32}
                                    />
                                    <span className="font-bold">
                                        {item?.dsp?.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => {
                                            window.open(item?.url, '_blank');
                                        }}
                                        type="default"
                                        shape="round"
                                        className={cn('group font-medium')}
                                    >
                                        <span>
                                            <p className="flex items-center gap-2">
                                                {messages(
                                                    'artist.visitProfile'
                                                )}
                                            </p>
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </>
                    );
                })}
            </div>
        </AppCard>
    );
}
