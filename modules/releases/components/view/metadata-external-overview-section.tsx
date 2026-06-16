import { DATE_FORMAT } from '@/enums/common';
import { ExternalMetadata, ReleasesData } from '@/modules/releases/types';
import { Col, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import InfoRow from './info-row';
import { OVERVIEW_COLUMN_GUTTER } from './overview-constants';
import OverviewText from './overview-text';

const { Title } = Typography;
const METADATA_EXTERNAL_SEPARATOR = ' - ';

type Props = {
    releaseData: ReleasesData;
};

type MetadataExternalItem = {
    key: string;
    name: string;
    metadata: ExternalMetadata;
};

function formatMetadataName(key: string) {
    return key.charAt(0).toUpperCase() + key.slice(1);
}

export default function MetadataExternalOverviewSection({
    releaseData,
}: Props) {
    const messages = useTranslations();
    const metadataExternalItems: MetadataExternalItem[] = Object.entries(
        releaseData.metadataExternal ?? {}
    )
        .filter(([, metadata]) => !!metadata)
        .map(([key, metadata]) => ({
            key,
            name: formatMetadataName(key),
            metadata: metadata as ExternalMetadata,
        }));

    if (!metadataExternalItems.length) {
        return (
            <section className="mb-8">
                <Title level={5} className="!mb-4 text-[16px] font-bold">
                    {messages('track.metadataExternal')}
                </Title>
                <Row gutter={OVERVIEW_COLUMN_GUTTER}>
                    <Col xs={24} lg={12}>
                        <InfoRow
                            label={messages('track.externalId')}
                            value={
                                <OverviewText
                                    value={messages('common.noDataAvailable')}
                                />
                            }
                        />
                    </Col>
                    <Col xs={24} lg={12}>
                        <InfoRow
                            label={messages('track.albumUrl')}
                            value={
                                <OverviewText
                                    value={messages('common.noDataAvailable')}
                                />
                            }
                        />
                    </Col>
                </Row>
            </section>
        );
    }

    return (
        <>
            {metadataExternalItems.map(({ key, name, metadata }) => {
                const coverArtUrl = metadata.coverImages?.[0]?.url;
                const lastSyncedAt = metadata.lastSyncedAt
                    ? dayjs(metadata.lastSyncedAt).format(
                          DATE_FORMAT.YEAR_MONTH_DAY_TIME
                      )
                    : undefined;

                return (
                    <section key={key} className="mb-8">
                        <Title
                            level={5}
                            className="!mb-4 text-[16px] font-bold"
                        >
                            {`${messages(
                                'track.metadataExternal'
                            )}${METADATA_EXTERNAL_SEPARATOR}${name}`}
                        </Title>
                        <Row gutter={OVERVIEW_COLUMN_GUTTER}>
                            <Col xs={24} lg={12}>
                                <InfoRow
                                    label={messages('track.externalId')}
                                    value={
                                        <OverviewText
                                            value={metadata.albumId}
                                            strong
                                        />
                                    }
                                    copyText={metadata.albumId}
                                />
                            </Col>
                            <Col xs={24} lg={12}>
                                <InfoRow
                                    label={messages('track.albumUrl')}
                                    value={
                                        <OverviewText
                                            value={metadata.albumUrl}
                                        />
                                    }
                                    copyText={metadata.albumUrl}
                                />
                            </Col>
                        </Row>
                    </section>
                );
            })}
        </>
    );
}
