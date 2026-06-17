import { ReleasesData } from '@/modules/releases/types';
import { Col, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import InfoRow from './info-row';
import { OVERVIEW_COLUMN_GUTTER } from './overview-constants';
import OverviewText from './overview-text';

const { Title } = Typography;

type Props = {
    releaseData: ReleasesData;
};

export default function CodeOverviewSection({ releaseData }: Props) {
    const messages = useTranslations();

    return (
        <section>
            <Title level={5} className="!mb-4 text-[16px] font-bold">
                {messages('common.code')}
            </Title>
            <Row gutter={OVERVIEW_COLUMN_GUTTER}>
                <Col xs={24} lg={12}>
                    <InfoRow
                        label={messages('formFields.upc')}
                        value={<OverviewText value={releaseData.upc} strong />}
                        copyText={releaseData.upc}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <InfoRow
                        label={messages('release.overview.catalogId')}
                        value={<OverviewText value={releaseData.catalogId} />}
                        copyText={releaseData.catalogId || undefined}
                    />
                </Col>
            </Row>
        </section>
    );
}
