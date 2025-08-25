import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { ArtistRoleData } from '@/modules/artist-role/types';
import { ArtistData } from '@/modules/artist/types';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { Avatar, Checkbox, CheckboxChangeEvent, theme } from 'antd';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
    index: number;
    data: {
        artist: ArtistData | undefined;
        artistRole: ArtistRoleData | undefined;
        addArtistToTracks?: boolean;
    };
    onDelete?: () => void;
    showApplyToAllTracks?: boolean;
    onApplyToAllTracks?: (checked: boolean) => void;
    disabled?: boolean;
};

export default function ArtistCard({
    showApplyToAllTracks,
    onApplyToAllTracks,
    index,
    data,
    onDelete,
    disabled = false,
    ...props
}: Props) {
    const messages = useTranslations();
    const handleChangeChecked = (e: CheckboxChangeEvent) => {
        onApplyToAllTracks?.(e.target.checked);
    };
    const formValues = useReleaseFormStore((state) => state.formValues);
    const artist = data?.artist;
    const artistRole = data.artistRole;
    const { token } = theme.useToken();

    return (
        <div
            className={cn(
                'flex cursor-pointer items-center justify-between rounded-lg bg-gray-100 px-3 py-2 hover:bg-gray-200',
                {
                    'pointer-events-none': disabled,
                    'cursor-not-allowed': disabled,
                }
            )}
            style={{
                background: token.colorBgContainer,
            }}
            {...props}
        >
            <div className="flex items-center gap-4">
                <div>
                    <Avatar size={40} shape="circle" src={artist?.picture}>
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
                                // defaultChecked={data?.addArtistToTracks}
                                checked={data?.addArtistToTracks}
                                onChange={(e: CheckboxChangeEvent) => {
                                    handleChangeChecked(e);
                                }}
                            >
                                <span> {messages('artist.addToTracks')}</span>
                            </Checkbox>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* <div>
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
                </div> */}

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
