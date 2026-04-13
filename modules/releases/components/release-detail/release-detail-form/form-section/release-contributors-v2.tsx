import { SIZE_ICON } from '@/constants/common';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_RELEASE_CONTRIBUTOR_LIST } from '@/modules/releases/enums';
import { Button } from 'antd';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import AddContributorForm from '../../../table/add-contributor-form';
import ReleaseContributorsTable from '../../../table/release-contributors-table';

type Props = {
    isReadMode: boolean;
    isCreateReleasePage: boolean;
    releaseContributor: any[];
};

export default function ReleaseContributorsSectionV2({
    isReadMode,
    isCreateReleasePage,
    releaseContributor,
}: Props) {
    // hooks
    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const messages = useTranslations();

    return (
        <div id="release-contributors" className="flex flex-col gap-6">
            <span className="text-base font-semibold">
                {messages('release.contributors')}
            </span>
            <div className="space-y-4">
                <ReleaseContributorsTable
                    dataSource={releaseContributor}
                    disabled={isReadMode}
                />
                {!isCreateReleasePage && !isReadMode && (
                    <Button
                        id="releaseContributors"
                        className="focus:!border-blue-500"
                        disabled={isCreateReleasePage || isReadMode}
                        icon={
                            <div>
                                <Plus size={SIZE_ICON} />
                            </div>
                        }
                        type="default"
                        shape="round"
                        onClick={() =>
                            openModal(
                                TYPE_MODAL_RELEASE_CONTRIBUTOR_LIST.ADD_CONTRIBUTOR
                            )
                        }
                    >
                        {messages('release.contributors')}
                    </Button>
                )}
                {TYPE_MODAL_RELEASE_CONTRIBUTOR_LIST.ADD_CONTRIBUTOR ===
                    typeModal && (
                    <AddContributorForm
                        open
                        disabled={isReadMode}
                        onCancel={() => closeModal()}
                    />
                )}
            </div>
        </div>
    );
}
