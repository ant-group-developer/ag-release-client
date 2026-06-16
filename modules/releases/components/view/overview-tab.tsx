import { ReleasesData } from '@/modules/releases/types';
import CodeOverviewSection from './code-overview-section';
import GenreLanguageOverviewSection from './genre-language-overview-section';
import LegalNoticesOverviewSection from './legal-notices-overview-section';
import MetadataExternalOverviewSection from './metadata-external-overview-section';
import ReleaseConfigurationOverviewSection from './release-configuration-overview-section';

type Props = {
    releaseData: ReleasesData;
};

export default function OverviewTab({ releaseData }: Props) {
    if (!releaseData) return null;

    return (
        <div className="py-4">
            <MetadataExternalOverviewSection releaseData={releaseData} />
            <ReleaseConfigurationOverviewSection releaseData={releaseData} />
            <CodeOverviewSection releaseData={releaseData} />
            <GenreLanguageOverviewSection releaseData={releaseData} />
            <LegalNoticesOverviewSection releaseData={releaseData} />
        </div>
    );
}
