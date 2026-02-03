import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { ArtistRoleData } from '@/modules/artist-role/types';
import { ArtistData } from '@/modules/artist/types';
import { Avatar, Checkbox, CheckboxChangeEvent, theme, Typography } from 'antd';
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
    const artist = data?.artist;
    const artistRole = data.artistRole;
    const { token } = theme.useToken();

    return (
        <div
            className={cn(
                'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2',
                {
                    'pointer-events-none': disabled,
                    'cursor-not-allowed': disabled,
                }
            )}
            style={{
                backgroundColor: disabled
                    ? token?.colorBgContainerDisabled
                    : token.colorPrimaryBg,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                    token.colorPrimaryBgHover;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = token.colorPrimaryBg;
            }}
            {...props}
        >
            <div className="flex items-center gap-4">
                <div>
                    <Avatar size={40} shape="circle" src={artist?.picture}>
                        {artist?.name.charAt(0).toUpperCase()}
                    </Avatar>
                </div>
                <div className="flex flex-col gap-1">
                    <p className="font-bold">{artist?.name}</p>
                    {showApplyToAllTracks && (
                        <div
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                e.stopPropagation();
                            }}
                        >
                            <Checkbox
                                defaultChecked={data?.addArtistToTracks}
                                // checked={data?.addArtistToTracks}
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
            <div className="flex gap-6 [&_.ant-typography]:text-xs">
                <div className="flex flex-col">
                    <Typography.Text type="secondary">
                        {messages('roles.label')}{' '}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                        {messages('country.label')}{' '}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                        {messages('genre.label')}{' '}
                    </Typography.Text>
                </div>
                <div className="flex flex-col">
                    <Typography.Text>{artistRole?.name}</Typography.Text>
                    <Typography.Text>{artist?.country?.name} </Typography.Text>
                    <Typography.Text>{artist?.genre?.name} </Typography.Text>
                </div>
            </div>
            <div className="flex justify-end gap-1">
                <CustomTooltip title={messages('artist.visitProfile')}>
                    <Avatar
                        size={28}
                        src="/icon/spotify.png"
                        className="hover:opacity-40"
                        onClick={(e) => {
                            e?.stopPropagation();
                            window.open(
                                'https://open.spotify.com/',
                                '_blank',
                                'noopener'
                            );
                        }}
                    />
                </CustomTooltip>
                <CustomTooltip title={messages('artist.visitProfile')}>
                    <Avatar
                        size={28}
                        src="/icon/apple-music.svg"
                        className="hover:opacity-40"
                        onClick={(e) => {
                            e?.stopPropagation();
                            window.open(
                                'https://open.spotify.com/',
                                '_blank',
                                'noopener'
                            );
                        }}
                    />
                </CustomTooltip>
            </div>
            <div className="flex items-center gap-2">
                <IconButton
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onDelete?.();
                    }}
                    shape="circle"
                    className="hover:bg-white"
                >
                    <Trash2 size={SIZE_ICON} className="text-red-500" />
                </IconButton>
            </div>
        </div>
    );
}
