import { ReleasesData } from '@/modules/releases/types';
import { Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import InfoRow from './info-row';

const { Text, Title, Link } = Typography;

type Props = {
    releaseData: ReleasesData;
};

export default function PrimaryInfoSection({ releaseData }: Props) {
    const messages = useTranslations();

    return (
        <div className="mb-8">
            <Title level={5} className="!mb-4 text-[16px] font-bold">
                {messages('release.overview.primaryInfo')}
            </Title>
            <div className="flex flex-col">
                <InfoRow
                    label={messages('release.overview.originalReleaseDate')}
                    value={
                        <Text className="text-[14px]">
                            {releaseData.releaseOriginalDate
                                ? dayjs(releaseData.releaseOriginalDate).format(
                                      'YYYY-MM-DD'
                                  )
                                : releaseData.releaseDate
                                  ? dayjs(releaseData.releaseDate).format(
                                        'YYYY-MM-DD'
                                    )
                                  : '-'}
                        </Text>
                    }
                />
                <InfoRow
                    label={messages('release.overview.releaseType')}
                    value={
                        <Text className="text-[14px]">
                            {releaseData.albumFormat?.name ||
                                messages('release.overview.single')}
                        </Text>
                    }
                />
            </div>
        </div>
    );
}
