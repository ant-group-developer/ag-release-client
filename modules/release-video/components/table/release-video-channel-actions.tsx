import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON, SIZE_ICON_BIG } from '@/constants/common';
import { APP_ROUTES } from '@/enums/routes';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { ReleasesData } from '@/modules/releases/types';
import { Avatar, Tooltip, Typography } from 'antd';
import { Pencil, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
import { TYPE_MODAL_RELEASE_VIDEO } from '../../enums';

type Props = {
    record: ReleasesData;
};

export const ReleaseVideoChannelActions = ({ record }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const router = useRouter();

    const channelName = record.video?.channel?.name;
    const youtubeChannelId = record.video?.channel?.youtubeChannelId;
    const youtubeVideoId = record.video?.externalId;

    return (
        <div className="flex h-7 items-center">
            {channelName && (
                <div
                    className="truncate text-xs group-hover:hidden"
                    data-stop-row-click="true"
                >
                    <Tooltip title={messages('common.viewOnYoutube')}>
                        <a
                            href={`https://www.youtube.com/channel/${youtubeChannelId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            <Typography.Text
                                type="secondary"
                                className="truncate"
                            >
                                {channelName}
                            </Typography.Text>
                        </a>
                    </Tooltip>
                </div>
            )}
            <div className="hidden items-center gap-1 group-hover:flex">
                {youtubeVideoId && (
                    <a
                        href={`https://www.youtube.com/watch?v=${youtubeVideoId}`}
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
                <PermissionGate permission={PERMISSION.RELEASE_VIDEO.UPDATE}>
                    <IconButton
                        shape="circle"
                        className="!h-7 !w-7 !min-w-7 p-1"
                        onClick={() => {
                            nProgress.start();
                            router.push(
                                `${APP_ROUTES.RELEASE_VIDEOS}/${record.id}`
                            );
                        }}
                    >
                        <Pencil size={SIZE_ICON} />
                    </IconButton>
                </PermissionGate>
                <PermissionGate permission={PERMISSION.RELEASE_VIDEO.DELETE}>
                    <IconButton
                        shape="circle"
                        className="!h-7 !w-7 !min-w-7 p-1"
                        onClick={() => {
                            openModal(TYPE_MODAL_RELEASE_VIDEO.DELETE, record);
                        }}
                    >
                        <Trash size={SIZE_ICON} color="red" />
                    </IconButton>
                </PermissionGate>
            </div>
        </div>
    );
};
