import { useTranslations } from 'next-intl';
import ReleaseContributorsTable from '../../../table/release-contributors-table';

type Props = {
    isReadMode: boolean;
    releaseContributor: any[];
};

export default function ReleaseContributorsSectionV2({
    isReadMode,
    releaseContributor,
}: Props) {
    const messages = useTranslations();

    return (
        <div id="release-contributors" className="flex flex-col gap-6">
            <span className="text-base font-semibold">
                {messages('release.contributors')}
            </span>
            <div id="releaseContributors">
                <ReleaseContributorsTable
                    dataSource={releaseContributor}
                    disabled={isReadMode}
                />
            </div>
        </div>
    );
}
