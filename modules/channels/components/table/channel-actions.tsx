import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON, SIZE_ICON_BIG } from '@/constants/common';
import useModalStore from '@/hooks/use-modal';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { Avatar } from 'antd';
import { Pencil, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_CHANNELS } from '../../enums';
import { ChannelsData } from '../../types';

type Props = {
    record: ChannelsData;
};

export const ChannelActions = ({ record }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const youtubeChannelId = record.youtubeChannelId;

    return (
        <div className="flex h-7 items-center">
            <div className="hidden items-center group-hover:flex">
                {youtubeChannelId && (
                    <a
                        href={`https://www.youtube.com/channel/${youtubeChannelId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-stop-row-click="true"
                    >
                        <IconButton
                            shape="circle"
                            className="!h-7 !w-7 !min-w-7 p-1"
                        >
                            <Avatar
                                size={SIZE_ICON_BIG}
                                src={'/icon/youtube.png'}
                            />
                        </IconButton>
                    </a>
                )}
                <PermissionGate permission={PERMISSION.CHANNEL.UPDATE}>
                    <IconButton
                        shape="circle"
                        className="!h-7 !w-7 !min-w-7 p-1"
                        onClick={() => {
                            openModal(TYPE_MODAL_CHANNELS.UPDATE, record);
                        }}
                    >
                        <Pencil size={SIZE_ICON} />
                    </IconButton>
                </PermissionGate>
                <PermissionGate permission={PERMISSION.CHANNEL.DELETE}>
                    <IconButton
                        shape="circle"
                        className="!h-7 !w-7 !min-w-7 p-1"
                        onClick={() => {
                            openModal(TYPE_MODAL_CHANNELS.DELETE, record);
                        }}
                    >
                        <Trash size={SIZE_ICON} color="red" />
                    </IconButton>
                </PermissionGate>
            </div>
        </div>
    );
};
