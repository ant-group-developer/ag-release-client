import { cn } from '@/helpers/common';
import { ArtistDataSimple, ArtistProfileData } from '@/modules/artist/types';
import { Avatar, Popover, Typography } from 'antd';
import CustomTooltip from '../tooltip/custom-tooltip';

interface ArtistOptionItemProps {
    item: ArtistDataSimple;
    disabled?: boolean;
    countryLabel: string;
    genreLabel: string;
}

export function ArtistOptionItem({
    item,
    disabled,
    countryLabel,
    genreLabel,
}: ArtistOptionItemProps) {
    const profiles = item?.artistProfiles ?? [];
    const mainProfiles = profiles.slice(0, 2);
    const extraProfiles = profiles.slice(2);

    const renderExtraPopoverContent = () => (
        <div className="flex items-center gap-1.5 p-1">
            {extraProfiles.map((profile: ArtistProfileData) => (
                <CustomTooltip
                    key={profile.id}
                    title={profile.dsp?.name || 'DSP'}
                >
                    <Avatar
                        size={26}
                        src={profile.dsp?.picture ?? ''}
                        className="hover:opacity-80 cursor-pointer"
                        onClick={(e) => {
                            e?.stopPropagation();
                            if (profile.url) {
                                window.open(profile.url, '_blank', 'noopener');
                            }
                        }}
                    />
                </CustomTooltip>
            ))}
        </div>
    );

    return (
        <div
            className={cn('grid grid-cols-3 items-center gap-1 py-1', {
                'opacity-50 cursor-not-allowed': disabled,
            })}
        >
            <span className="truncate">
                <CustomTooltip title={item.name}>{item.name}</CustomTooltip>
            </span>
            <div className="flex gap-4">
                <div className="flex flex-col">
                    <Typography.Text type="secondary" className="text-xs">
                        {countryLabel}
                    </Typography.Text>
                    <Typography.Text type="secondary" className="text-xs">
                        {genreLabel}
                    </Typography.Text>
                </div>
                <div className="flex flex-col font-medium">
                    <Typography.Text className="text-xs" ellipsis>
                        {item?.country?.name || '-'}
                    </Typography.Text>
                    <Typography.Text className="text-xs" ellipsis>
                        {item?.genre?.name || '-'}
                    </Typography.Text>
                </div>
            </div>
            <div className="mr-2 flex justify-end gap-1 items-center">
                <div className="flex items-center -space-x-1.5">
                    {mainProfiles.map((profile: ArtistProfileData) => (
                        <CustomTooltip
                            key={profile.id}
                            title={profile.dsp?.name || 'DSP'}
                        >
                            <Avatar
                                size={26}
                                src={profile.dsp?.picture ?? ''}
                                className="hover:opacity-80 cursor-pointer border border-white dark:border-gray-800"
                                onClick={(e) => {
                                    e?.stopPropagation();
                                    if (profile.url) {
                                        window.open(
                                            profile.url,
                                            '_blank',
                                            'noopener'
                                        );
                                    }
                                }}
                            />
                        </CustomTooltip>
                    ))}
                    {extraProfiles.length > 0 && (
                        <Popover
                            content={renderExtraPopoverContent()}
                            trigger="hover"
                            placement="topRight"
                            zIndex={9999}
                        >
                            <Avatar
                                size={26}
                                className="bg-gray-400 text-white text-xs cursor-pointer border border-white dark:border-gray-800 flex items-center justify-center font-medium"
                                onClick={(e) => e?.stopPropagation()}
                            >
                                +{extraProfiles.length}
                            </Avatar>
                        </Popover>
                    )}
                </div>
            </div>
        </div>
    );
}
