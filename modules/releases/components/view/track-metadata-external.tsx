import { TrackData } from '@/modules/tracks/types';
import { Avatar, Col, Row, Space } from 'antd';
import { useTranslations } from 'next-intl';
import InfoRow from './info-row';
import { OVERVIEW_COLUMN_GUTTER } from './overview-constants';
import OverviewText from './overview-text';

function normalizeMetadataKey(value?: string | null) {
    return value?.trim().toLowerCase();
}

function getDspByMetadataKey(key: string, dspData: any[]) {
    const normalizedKey = normalizeMetadataKey(key);

    return dspData.find((item) =>
        [item.code, item.codeCi, item.name].some(
            (value) => normalizeMetadataKey(value) === normalizedKey
        )
    );
}

interface TrackMetadataExternalProps {
    metadataExternal: TrackData['metadataExternal'];
    dspItems: any[];
}

export default function TrackMetadataExternal({
    metadataExternal,
    dspItems,
}: TrackMetadataExternalProps) {
    const messages = useTranslations();

    if (!metadataExternal || Object.entries(metadataExternal).length === 0) {
        return null;
    }

    return (
        <div className="mx-6 flex flex-col gap-1">
            {Object.entries(metadataExternal)
                .filter(([, metadata]) => !!metadata)
                .map(([key, metadata]: [string, any]) => {
                    const dsp = getDspByMetadataKey(key, dspItems);
                    const name = key;

                    return (
                        <Row
                            key={key}
                            gutter={OVERVIEW_COLUMN_GUTTER}
                            align="middle"
                            className="rounded-lg bg-zinc-100"
                        >
                            <Col xs={24} lg={3}>
                                <Space align="center">
                                    <Avatar
                                        size={24}
                                        shape="square"
                                        src={dsp?.picture}
                                        className="flex-shrink-0 rounded"
                                    >
                                        {name[0]?.toUpperCase()}
                                    </Avatar>
                                    <span className="font-semibold capitalize">
                                        {name}
                                    </span>
                                </Space>
                            </Col>

                            <Col xs={24} lg={9}>
                                <InfoRow
                                    label={messages('track.id') || 'Track ID'}
                                    value={
                                        <OverviewText
                                            value={
                                                metadata.trackId ||
                                                metadata.albumId
                                            }
                                            strong
                                        />
                                    }
                                    copyText={
                                        metadata.trackId || metadata.albumId
                                    }
                                />
                            </Col>
                            <Col xs={24} lg={12}>
                                <InfoRow
                                    label={messages('track.trackUrl')}
                                    value={
                                        metadata.trackUrl ||
                                        metadata.albumUrl ? (
                                            <a
                                                href={
                                                    metadata.trackUrl ||
                                                    metadata.albumUrl
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[14px] font-normal !text-purple-600 hover:!text-purple-800 hover:underline"
                                            >
                                                {metadata.trackUrl ||
                                                    metadata.albumUrl}
                                            </a>
                                        ) : (
                                            <OverviewText
                                                value={
                                                    metadata.trackUrl ||
                                                    metadata.albumUrl
                                                }
                                            />
                                        )
                                    }
                                    copyText={
                                        metadata.trackUrl || metadata.albumUrl
                                    }
                                />
                            </Col>
                        </Row>
                    );
                })}
        </div>
    );
}
