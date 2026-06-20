import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { ExternalMetadata, ReleasesData } from '@/modules/releases/types';
import { CopyOutlined } from '@ant-design/icons';
import { Avatar, Space, Table, Tooltip, Typography, message } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import OverviewText from './overview-text';

const { Title } = Typography;
const DSP_LIST_PAGE_SIZE = 1000;
const AVATAR_SIZE = 24;
const LINK_TARGET_BLANK = '_blank';
const LINK_REL_NOOPENER = 'noopener noreferrer';
const TABLE_SIZE = 'small';
const ROW_KEY_PROP = 'key';

type Props = {
    releaseData: ReleasesData;
};

type MetadataExternalItem = {
    key: string;
    name: string;
    metadata: ExternalMetadata;
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

export default function MetadataExternalOverviewSection({
    releaseData,
}: Props) {
    const messages = useTranslations();
    const { dspData } = useGetListDsp({ pageSize: DSP_LIST_PAGE_SIZE });

    const metadataExternalItems: MetadataExternalItem[] = Object.entries(
        releaseData.metadataExternal ?? {}
    )
        .filter(([, metadata]) => !!metadata)
        .map(([key, metadata]) => ({
            key,
            name: key,
            metadata: metadata as ExternalMetadata,
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
                title: messages('track.externalId'),
                key: 'albumId',
                render: (_: any, record: MetadataExternalItem) => {
                    const albumId = record.metadata.albumId;
                    return (
                        <div className="flex items-center gap-2">
                            <OverviewText value={albumId} />
                            {albumId && (
                                <Tooltip title={messages('common.copy')}>
                                    <CopyOutlined
                                        className="cursor-pointer text-[14px] text-gray-400 transition-colors hover:text-gray-600"
                                        onClick={() =>
                                            handleCopy(
                                                albumId,
                                                messages('track.externalId')
                                            )
                                        }
                                    />
                                </Tooltip>
                            )}
                        </div>
                    );
                },
            },
            {
                title: messages('track.albumUrl'),
                key: 'albumUrl',
                render: (_: any, record: MetadataExternalItem) => {
                    const albumUrl = record.metadata.albumUrl;
                    return albumUrl ? (
                        <div className="flex items-center gap-2">
                            <Typography.Link
                                href={albumUrl}
                                target={LINK_TARGET_BLANK}
                                rel={LINK_REL_NOOPENER}
                                className="!hover:text-purple-800 truncate !text-purple-600 hover:underline"
                            >
                                {albumUrl}
                            </Typography.Link>
                            <Tooltip title={messages('common.copy')}>
                                <CopyOutlined
                                    className="flex-shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
                                    onClick={() =>
                                        handleCopy(
                                            albumUrl,
                                            messages('track.albumUrl')
                                        )
                                    }
                                />
                            </Tooltip>
                        </div>
                    ) : (
                        <OverviewText value={albumUrl} />
                    );
                },
            },
        ];
    }, [dspItems, messages]);

    if (!metadataExternalItems.length) {
        return null;
    }

    return (
        <>
            <Title level={5} className="!mb-4 text-[16px] font-bold">
                {messages('release.overview.albumLink')}
            </Title>
            <Table
                dataSource={metadataExternalItems}
                pagination={false}
                rowKey={ROW_KEY_PROP}
                size={TABLE_SIZE}
                columns={columns}
            />
        </>
    );
}
