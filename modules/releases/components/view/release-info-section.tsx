import { ReleasesData } from '@/modules/releases/types';
import type { DescriptionsProps } from 'antd';
import { Card, Descriptions, theme, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

const { Text } = Typography;

type Props = {
    releaseData: ReleasesData;
};

export default function ReleaseInfoSection({ releaseData }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    if (!releaseData) return null;

    const FALLBACK_VALUE = '-';
    const DATE_FORMAT_STAMP = 'YYYY-MM-DD';

    const pLine =
        releaseData.pLineYear && releaseData.pLineOwner
            ? `${releaseData.pLineYear} ${releaseData.pLineOwner}`
            : '';

    const cLine =
        releaseData.cLineYear && releaseData.cLineOwner
            ? `${releaseData.cLineYear} ${releaseData.cLineOwner}`
            : '';

    const getTerritoryDisplay = () => {
        if (releaseData.releaseTerritory?.distributeWorldwide) {
            return messages('distribute.wordWide');
        }
        const countries =
            releaseData.releaseTerritory?.selectedCountries?.join(', ') || '';
        if (releaseData.releaseTerritory?.distributionType === 'only') {
            return `${messages('distribute.onlyIn')}: ${countries}`;
        }
        if (releaseData.releaseTerritory?.distributionType === 'except') {
            return `${messages('distribute.everyWhereExcept')}: ${countries}`;
        }
        return FALLBACK_VALUE;
    };

    const items: DescriptionsProps['items'] = [
        {
            key: 'originalReleaseDate',
            label: messages('release.overview.originalReleaseDate'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.releaseOriginalDate
                        ? dayjs(releaseData.releaseOriginalDate).format(
                              DATE_FORMAT_STAMP
                          )
                        : releaseData.releaseDate
                          ? dayjs(releaseData.releaseDate).format(
                                DATE_FORMAT_STAMP
                            )
                          : FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'releaseDate',
            label: messages('release.overview.releaseDate'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.releaseDate
                        ? dayjs(releaseData.releaseDate).format(
                              DATE_FORMAT_STAMP
                          )
                        : FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'releaseTime',
            label: messages('release.overview.releaseTime'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.releaseTime || FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'timezone',
            label: messages('release.overview.timezone'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.timeZone?.name ||
                        releaseData.timeZone?.zone ||
                        FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'releaseType',
            label: messages('release.overview.releaseType'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.albumFormat?.name ||
                        messages('release.overview.single')}
                </Text>
            ),
        },
        {
            key: 'version',
            label: messages('release.overview.version'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.version || FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'upc',
            label: messages('release.overview.upc'),
            children: releaseData.upc ? (
                <Text
                    copyable={{ text: releaseData.upc }}
                    className="text-[14px] font-medium"
                >
                    {releaseData.upc}
                </Text>
            ) : (
                FALLBACK_VALUE
            ),
        },
        {
            key: 'catalogId',
            label: messages('release.overview.catalogId'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.catalogId || FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'primaryGenre',
            label: messages('release.overview.primaryGenre'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.primaryGenre?.name || FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'subGenre',
            label: messages('release.overview.subGenre'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.subGenre?.name || FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'label',
            label: messages('release.overview.label'),
            children: (
                <Text strong className="text-[14px]">
                    {releaseData.label?.name || FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'pLine',
            label: messages('release.overview.pLine'),
            children: (
                <Text className="text-[14px]">{pLine || FALLBACK_VALUE}</Text>
            ),
        },
        {
            key: 'cLine',
            label: messages('release.overview.cLine'),
            children: (
                <Text className="text-[14px]">{cLine || FALLBACK_VALUE}</Text>
            ),
        },

        {
            key: 'isInstrumental',
            label: messages('release.overview.isInstrumental'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.isInstrumental
                        ? messages('common.yes')
                        : messages('common.no')}
                </Text>
            ),
        },
        {
            key: 'metadataLanguage',
            label: messages('release.overview.metadataLanguage'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.releaseLanguage?.metadataLanguage?.name ||
                        FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'audioLanguage',
            label: messages('release.overview.audioLanguage'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.releaseLanguage?.audioLanguage?.name ||
                        FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'metadataLanguageCountry',
            label: messages('release.overview.metadataLanguageCountry'),
            children: (
                <Text className="text-[14px]">
                    {releaseData.releaseLanguage?.metadataLanguageCountry
                        ?.name || FALLBACK_VALUE}
                </Text>
            ),
        },
        {
            key: 'territory',
            label: messages('release.overview.territory'),
            children: (
                <Text className="text-[14px]">{getTerritoryDisplay()}</Text>
            ),
        },
    ];

    return (
        <Card
            title={
                <span className="text-base font-semibold">
                    {messages('release.overview.releaseInfo')}
                </span>
            }
            styles={{
                body: { padding: '24px' },
            }}
        >
            <Descriptions
                layout="horizontal"
                bordered={true}
                column={{ xs: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
                items={items}
                labelStyle={{
                    color: token.colorTextSecondary,
                    fontSize: '14px',
                }}
                contentStyle={{
                    color: token.colorText,
                    fontSize: '14px',
                    fontWeight: 500,
                }}
            />
        </Card>
    );
}
