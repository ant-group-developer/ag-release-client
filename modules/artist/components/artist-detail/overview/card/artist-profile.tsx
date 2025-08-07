import AppCard from '@/components/ant-music/app-card';
import { cn } from '@/helpers/common';
import { ArtistData } from '@/modules/artist/types';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = {
    artistData: ArtistData;
};

export default function ArtistProfileCard({ artistData }: Props) {
    const messages = useTranslations();
    const artistProfiles = artistData?.artistProfiles;
    const dspData = artistProfiles?.map((item) => item.dsp) ?? [];
    return (
        <AppCard title={messages('artist.profiles')}>
            <div
                className={cn(
                    'flex max-h-[245px] flex-col gap-2 overflow-y-auto rounded-md bg-zinc-100'
                )}
            >
                {dspData.map((item, index) => {
                    return (
                        <>
                            <div
                                key={index}
                                className={cn(
                                    'flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-gray-200'
                                    // linked
                                    //     ? 'bg-green-500 text-white hover:bg-green-500'
                                    //     : 'bg-gray-100'
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <Image
                                        className="rounded-full"
                                        src={item.picture ?? ''}
                                        alt={item.name || ''}
                                        width={32}
                                        height={32}
                                    />
                                    <span className="font-bold">
                                        {item.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        // onClick={() =>
                                        //     setSelectedPlatform(item)
                                        // }
                                        type="text"
                                        shape="round"
                                        className={cn(
                                            'group !bg-zinc-300/50 font-medium hover:!bg-zinc-300'
                                        )}
                                    >
                                        <span>
                                            <p className="flex items-center gap-2">
                                                Visit profile
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
