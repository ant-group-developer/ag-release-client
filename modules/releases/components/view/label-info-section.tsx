import { ReleasesData } from '@/modules/releases/types';
import { Col, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import InfoRow from './info-row';

const { Text, Title } = Typography;

type Props = {
    releaseData: ReleasesData;
};

export default function LabelInfoSection({ releaseData }: Props) {
    const messages = useTranslations();

    const pLine =
        releaseData.pLineYear && releaseData.pLineOwner
            ? `${releaseData.pLineYear} ${releaseData.pLineOwner}`
            : '';

    const cLine =
        releaseData.cLineYear && releaseData.cLineOwner
            ? `${releaseData.cLineYear} ${releaseData.cLineOwner}`
            : '';

    return (
        <div className="mt-4">
            <Title level={5} className="!mb-4 text-[16px] font-bold">
                {messages('release.overview.labelInfo')}
            </Title>
            <Row gutter={[48, 0]}>
                <Col xs={24} lg={12}>
                    <div className="flex flex-col">
                        <InfoRow
                            label={messages('release.overview.label')}
                            value={
                                <Text strong>
                                    {releaseData.label?.name || '-'}
                                </Text>
                            }
                        />

                        <InfoRow
                            label={messages('release.overview.pLine')}
                            value={<Text>{pLine || '-'}</Text>}
                        />
                    </div>
                </Col>
                <Col xs={24} lg={12}>
                    <div className="flex flex-col">
                        <InfoRow
                            label={messages('release.overview.licensor')}
                            value={<Text>{releaseData.pLineOwner || '-'}</Text>}
                        />
                        <InfoRow
                            label={messages('release.overview.cLine')}
                            value={<Text>{cLine || '-'}</Text>}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
}
