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

export default function GenreLanguageOverviewSection({ releaseData }: Props) {
    const messages = useTranslations();
    const isInstrumentalText = releaseData.isInstrumental
        ? messages('common.yes')
        : messages('common.no');

    return (
        <section>
            <Title level={5} className="!mb-4 text-[16px] font-bold">
                {`${messages('genre.label')} & ${messages('language.label')}`}
            </Title>
            <Row gutter={OVERVIEW_COLUMN_GUTTER}>
                <Col xs={24} lg={12}>
                    <InfoRow
                        label={messages('genres.primary')}
                        value={
                            <OverviewText
                                value={releaseData.primaryGenre?.name}
                            />
                        }
                    />
                    <InfoRow
                        label={messages('release.metadataLanguage')}
                        value={
                            <OverviewText
                                value={
                                    releaseData.releaseLanguage
                                        ?.metadataLanguage?.name
                                }
                            />
                        }
                    />
                    <InfoRow
                        label={messages('release.overview.isInstrumental')}
                        value={<OverviewText value={isInstrumentalText} />}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <InfoRow
                        label={messages('common.subGenres')}
                        value={
                            <OverviewText value={releaseData.subGenre?.name} />
                        }
                    />
                    <InfoRow
                        label={messages('release.countryLanguage')}
                        value={
                            <OverviewText
                                value={
                                    releaseData.releaseLanguage
                                        ?.metadataLanguageCountry?.name
                                }
                            />
                        }
                    />
                    <InfoRow
                        label={messages('release.audioLanguage')}
                        value={
                            <OverviewText
                                value={
                                    releaseData.releaseLanguage?.audioLanguage
                                        ?.name
                                }
                            />
                        }
                    />
                </Col>
            </Row>
        </section>
    );
}
