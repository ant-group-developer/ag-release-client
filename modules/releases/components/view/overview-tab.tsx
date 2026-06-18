import { ReleasesData } from '@/modules/releases/types';
import { Empty, theme } from 'antd';
import { PropsWithChildren } from 'react';
import CodeOverviewSection from './code-overview-section';
import GenreLanguageOverviewSection from './genre-language-overview-section';
import LegalNoticesOverviewSection from './legal-notices-overview-section';
import MetadataExternalOverviewSection from './metadata-external-overview-section';
import ReleaseArtistsSection from './release-artists-section';
import ReleaseConfigurationOverviewSection from './release-configuration-overview-section';
import ReleaseContributorsSection from './release-contributors-section';

type Props = {
    releaseData: ReleasesData;
};

type OverviewSectionCardProps = PropsWithChildren<{
    isEmpty?: boolean;
}>;

function OverviewSectionCard({
    children,
    isEmpty = false,
}: OverviewSectionCardProps) {
    const { token } = theme.useToken();

    return (
        <div
            className="rounded-lg p-6 shadow-sm"
            style={{ backgroundColor: token.colorBgContainer }}
        >
            {isEmpty ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                children
            )}
        </div>
    );
}

export default function OverviewTab({ releaseData }: Props) {
    if (!releaseData) return null;

    return (
        <div className="flex flex-col gap-4 pb-4">
            <OverviewSectionCard>
                <MetadataExternalOverviewSection releaseData={releaseData} />
            </OverviewSectionCard>
            <OverviewSectionCard>
                <ReleaseArtistsSection releaseData={releaseData} />
            </OverviewSectionCard>
            <OverviewSectionCard>
                <ReleaseContributorsSection releaseData={releaseData} />
            </OverviewSectionCard>
            <OverviewSectionCard>
                <ReleaseConfigurationOverviewSection
                    releaseData={releaseData}
                />
            </OverviewSectionCard>
            <OverviewSectionCard>
                <CodeOverviewSection releaseData={releaseData} />
            </OverviewSectionCard>
            <OverviewSectionCard>
                <GenreLanguageOverviewSection releaseData={releaseData} />
            </OverviewSectionCard>
            <OverviewSectionCard>
                <LegalNoticesOverviewSection releaseData={releaseData} />
            </OverviewSectionCard>
        </div>
    );
}
