import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Avatar, Checkbox, CheckboxChangeEvent } from 'antd';
import { Trash2 } from 'lucide-react';
import { HTMLAttributes } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
    index: number;
    data: any;
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
    const handleChangeChecked = (e: CheckboxChangeEvent) => {
        onApplyToAllTracks?.(e.target.checked);
    };
    const formValues = useReleaseFormStore((state) => state.formValues);
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
                <div>
                    <p className="font-bold">{data?.name}</p>
                    <p>
                        <span>1569468 | </span>
                        <span>{data?.role}</span>
                    </p>
                    {showApplyToAllTracks && (
                        <div
                            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                                e.stopPropagation();
                            }}
                        >
                            <Checkbox
                                defaultChecked={formValues?.artistsApplyAllTracks?.some(
                                    (item: any) => item.name === data.name
                                )}
                                onChange={(e: CheckboxChangeEvent) => {
                                    handleChangeChecked(e);
                                }}
                            />
                            <span> Thêm nghệ sĩ vào các bài hát</span>
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

                <div className="w-8">
                    {/* {index !== 0 && ( */}
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.();
                            // openModal(
                            //     TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST,
                            //     data
                            // );
                        }}
                    >
                        <Trash2 size={SIZE_ICON} className="text-red-500" />
                    </IconButton>
                    {/* )} */}
                </div>
            </div>
        </div>
    );
}
