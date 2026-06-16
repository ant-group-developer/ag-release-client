import { ReleasesData } from '@/modules/releases/types';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';
import InfoRow from './info-row';

const { Text, Title } = Typography;

type Props = {
    releaseData: ReleasesData;
};

export default function ReleaseIdentifiersSection({ releaseData }: Props) {
    const messages = useTranslations();

    return (
        <div className="mb-8">
            <Title level={5} className="!mb-4 text-[16px] font-bold">
                {messages('release.overview.releaseIdentifiers')}
            </Title>
            <div className="flex flex-col">
                <InfoRow
                    label={messages('release.overview.upc')}
                    value={
                        <Text strong className="text-[14px]">
                            {releaseData.upc || '-'}
                        </Text>
                    }
                    copyText={releaseData.upc}
                />
            </div>
        </div>
    );
}
