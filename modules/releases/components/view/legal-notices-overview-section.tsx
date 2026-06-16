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

export default function LegalNoticesOverviewSection({ releaseData }: Props) {
    const messages = useTranslations();

    return (
        <section className="mb-8">
            <Title level={5} className="!mb-4 text-[16px] font-bold">
                {messages('common.legalNotices')}
            </Title>
            <Row gutter={OVERVIEW_COLUMN_GUTTER}>
                <Col xs={24} lg={12}>
                    <InfoRow
                        label={messages('formFields.cLineYear')}
                        value={<OverviewText value={releaseData.cLineYear} />}
                    />
                    <InfoRow
                        label={messages('formFields.pLineYear')}
                        value={<OverviewText value={releaseData.pLineYear} />}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <InfoRow
                        label={messages('formFields.cLineOwner')}
                        value={<OverviewText value={releaseData.cLineOwner} />}
                    />
                    <InfoRow
                        label={messages('formFields.pLineOwner')}
                        value={<OverviewText value={releaseData.pLineOwner} />}
                    />
                </Col>
            </Row>
        </section>
    );
}
