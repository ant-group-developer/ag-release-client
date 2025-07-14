import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { Avatar, Checkbox, CheckboxChangeEvent } from 'antd';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
    index: number;
    data: ReleaseArtist;
    onDelete?: () => void;
    showApplyToAllTracks?: boolean;
    onApplyToAllTracks?: (checked: boolean) => void;
};

export default function ArtistCard({
    showApplyToAllTracks,
    onApplyToAllTracks,
    index,
    data,
    onDelete,
    ...props
}: Props) {
    const messages = useTranslations();
    const handleChangeChecked = (e: CheckboxChangeEvent) => {
        onApplyToAllTracks?.(e.target.checked);
    };
    const formValues = useReleaseFormStore((state) => state.formValues);
    const artist = data?.artist;
    const artistRole = data.artistRole;
    return (
        <div
            className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200"
            {...props}
        >
            <div className="flex items-center gap-4">
                <div>
                    <Avatar size={40} shape="circle" src="/logo.png">
                        {'A'}
                    </Avatar>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="font-bold">{artist?.name}</p>
                    <p>
                        <span>{artist?.id} | </span>
                        <span>{artistRole?.name}</span>
                    </p>
                    {showApplyToAllTracks && (
                        <div
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                e.stopPropagation();
                            }}
                        >
                            <Checkbox
                                // defaultChecked={formValues?.artistsApplyAllTracks?.some(
                                //     (item: any) => item.name === data.name
                                // )}
                                onChange={(e: CheckboxChangeEvent) => {
                                    handleChangeChecked(e);
                                }}
                            />
                            <span> {messages('artist.addToTracks')}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div>
                    <Avatar.Group
                        max={{
                            count: 3,
                            style: {
                                color: '#f56a00',
                                backgroundColor: '#fde3cf',
                            },
                        }}
                        size={24}
                    >
                        <Avatar src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png" />
                        <Avatar src="https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-tiktok-inkythuatso-2-mesa-de-trabajo-1-27-09-13-05.jpg">
                            A
                        </Avatar>
                        <Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbhvKe4ebnX7xrphoWADoK-wteStypzRFKWQ&s" />
                        <Avatar src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/2048px-Youtube_Music_icon.svg.png" />
                    </Avatar.Group>
                </div>

                <div className="w-8" onClick={(e) => e.stopPropagation()}>
                    <IconButton
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onDelete?.();
                        }}
                    >
                        <Trash2 size={SIZE_ICON} className="text-red-500" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}
