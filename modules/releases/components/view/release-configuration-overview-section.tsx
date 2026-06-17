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

export default function ReleaseConfigurationOverviewSection({
    releaseData,
}: Props) {
    const messages = useTranslations();

    return (
        <section>
            <Title level={5} className="!mb-4 text-[16px] font-bold">
                {messages('release.configuration')}
            </Title>
            <Row gutter={OVERVIEW_COLUMN_GUTTER}>
                <Col xs={24} lg={12}>
                    <InfoRow
                        label={messages('release.name')}
                        value={
                            <OverviewText value={releaseData.title} strong />
                        }
                    />
                    <InfoRow
                        label={messages('release.overview.label')}
                        value={
                            <OverviewText
                                value={releaseData.label?.name}
                                strong
                            />
                        }
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <InfoRow
                        label={messages('release.version')}
                        value={<OverviewText value={releaseData.version} />}
                    />
                    <InfoRow
                        label={messages('release.type')}
                        value={
                            <OverviewText
                                value={
                                    releaseData.albumFormat?.name ||
                                    messages('release.overview.single')
                                }
                            />
                        }
                    />
                </Col>
            </Row>
        </section>
    );
}
