import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { ExternalMetadata, ReleasesData } from '@/modules/releases/types';
import { Avatar, Col, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import InfoRow from './info-row';
import { OVERVIEW_COLUMN_GUTTER } from './overview-constants';
import OverviewText from './overview-text';

const { Title } = Typography;
const DSP_LIST_PAGE_SIZE = 1000;

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

    if (!metadataExternalItems.length) {
        return null;
    }

    return (
        <>
            {metadataExternalItems.map(({ key, name, metadata }) => {
                const dsp = getDspByMetadataKey(key, dspItems);

                return (
                    <section key={key}>
                        <Title
                            level={5}
                            className="!mb-4 flex items-center gap-2 text-[16px] font-bold"
                        >
                            <Avatar
                                size={24}
                                shape="square"
                                src={dsp?.picture}
                                className="flex-shrink-0 rounded"
                            >
                                {name[0]?.toUpperCase()}
                            </Avatar>
                            <span>{name}</span>
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
