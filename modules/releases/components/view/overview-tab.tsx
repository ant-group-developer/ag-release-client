import { ReleasesData } from '@/modules/releases/types';
import { theme } from 'antd';
import { PropsWithChildren } from 'react';
import CodeOverviewSection from './code-overview-section';
import GenreLanguageOverviewSection from './genre-language-overview-section';
import LegalNoticesOverviewSection from './legal-notices-overview-section';
import MetadataExternalOverviewSection from './metadata-external-overview-section';
import ReleaseConfigurationOverviewSection from './release-configuration-overview-section';

type Props = {
    releaseData: ReleasesData;
};

function OverviewSectionCard({ children }: PropsWithChildren) {
    const { token } = theme.useToken();

    return (
        <div
            className="rounded-lg p-6 shadow-sm"
            style={{ backgroundColor: token.colorBgContainer }}
        >
            {children}
        </div>
    );
}

export default function OverviewTab({ releaseData }: Props) {
    if (!releaseData) return null;

    const shouldShowMetadataExternal =
        Object.values(releaseData.metadataExternal || {}).length > 0;

    return (
        <div className="flex flex-col gap-4 pb-4">
            {shouldShowMetadataExternal && (
                <OverviewSectionCard>
                    <MetadataExternalOverviewSection
                        releaseData={releaseData}
                    />
                </OverviewSectionCard>
            )}
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
