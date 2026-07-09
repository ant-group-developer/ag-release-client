import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { TrackData } from '@/modules/tracks/types';
import { CopyOutlined } from '@ant-design/icons';
import {
    Avatar,
    Space,
    Table,
    Tooltip,
    Typography,
    message,
    theme,
} from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

const { Text, Link } = Typography;
const DSP_LIST_PAGE_SIZE = 1000;
const AVATAR_SIZE = 24;
const LINK_TARGET_BLANK = '_blank';
const LINK_REL_NOOPENER = 'noopener noreferrer';
const TABLE_SIZE = 'small';
const ROW_KEY_PROP = 'key';

type Props = {
    trackData?: TrackData;
};

type MetadataExternalItem = {
    key: string;
    name: string;
    metadata: any;
};

function normalizeMetadataKey(value?: string | null) {
    return value?.trim().toLowerCase();
}

function getDspByMetadataKey(key: string, dspData: DspData[]) {
    const normalizedKey = normalizeMetadataKey(key);

    return dspData.find((item) =>
        [item.code, item.codeCi, item.name].some(
            (value) => normalizeMetadataKey(value) === normalizedKey
        )
    );
}

export default function TrackExternalSection({ trackData }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { dspData } = useGetListDsp({ pageSize: DSP_LIST_PAGE_SIZE });

    const metadataExternalItems: MetadataExternalItem[] = Object.entries(
        trackData?.metadataExternal ?? {}
    )
        .filter(([, metadata]) => !!metadata)
        .map(([key, metadata]) => ({
            key,
            name: key,
            metadata: metadata,
        }));

    const dspItems = useMemo(() => dspData?.items ?? [], [dspData?.items]);

    const handleCopy = (text: string, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        message.success(`${messages('common.copied')} ${label}!`);
    };

    const columns = useMemo(() => {
        return [
            {
                title: messages('track.dsp'),
                key: 'dsp',
                width: '25%',
                render: (_: any, record: MetadataExternalItem) => {
                    const dsp = getDspByMetadataKey(record.key, dspItems);
                    return (
                        <Space align="center">
                            <Avatar
                                size={AVATAR_SIZE}
                                shape="square"
                                src={dsp?.picture}
                                className="flex-shrink-0 rounded"
                            >
                                {record.name[0]?.toUpperCase()}
                            </Avatar>
                            <span className="capitalize">{record.name}</span>
                        </Space>
                    );
                },
            },
            {
                title: messages('track.id'),
                key: 'trackId',
                width: '25%',
                render: (_: any, record: MetadataExternalItem) => {
                    const trackId = record.metadata.trackId || record.metadata.albumId;
                    return (
                        <Space align="center">
                            <Text className="text-[14px]">
                                {trackId || '-'}
                            </Text>
                            {trackId && (
                                <Tooltip title={messages('common.copy')}>
                                    <CopyOutlined
                                        style={{
                                            color: token.colorTextDescription,
                                        }}
                                        className="cursor-pointer transition-colors hover:opacity-80"
                                        onClick={() =>
                                            handleCopy(
                                                trackId,
                                                messages('track.id')
                                            )
                                        }
                                    />
                                </Tooltip>
                            )}
                        </Space>
                    );
                },
            },
            {
                title: messages('track.trackUrl'),
                key: 'trackUrl',
                width: '50%',
                render: (_: any, record: MetadataExternalItem) => {
                    const trackUrl = record.metadata.trackUrl || record.metadata.albumUrl;
                    return trackUrl ? (
                        <Space align="center">
                            <Link
                                href={trackUrl}
                                target={LINK_TARGET_BLANK}
                                rel={LINK_REL_NOOPENER}
                                className="truncate !text-purple-500 hover:!text-purple-600 hover:underline"
                            >
                                {trackUrl}
                            </Link>
                            <Tooltip title={messages('common.copy')}>
                                <CopyOutlined
                                    style={{
                                        color: token.colorTextDescription,
                                    }}
                                    className="flex-shrink-0 cursor-pointer transition-colors hover:opacity-80"
                                    onClick={() =>
                                        handleCopy(
                                            trackUrl,
                                            messages('track.trackUrl')
                                        )
                                    }
                                />
                            </Tooltip>
                        </Space>
                    ) : (
                        <Text className="text-[14px]">-</Text>
                    );
                },
            },
        ];
    }, [dspItems, messages, token]);

    if (!metadataExternalItems.length) {
        return null;
    }

    return (
        <div id="trackExternalSection" className="flex flex-col gap-4">
            <span className="text-base font-semibold">
                {messages('release.overview.platformLinks')}
            </span>
            <Table
                dataSource={metadataExternalItems}
                pagination={false}
                rowKey={ROW_KEY_PROP}
                size={TABLE_SIZE}
                columns={columns}
            />
        </div>
    );
}
