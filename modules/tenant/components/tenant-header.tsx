import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import Refresh from '@/components/refresh';
import CreateButton from '@/components/ui/button/create-button';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_TENANT } from '../enums';
import { DataFilterTenant } from '../types/data';
import TenantHeaderFilter from './tenant-header-filter';

type Props = {
    handleRefresh: () => void;
    lastUpdatedAt: string;
} & Pick<
    UseFilterProps<DataFilterTenant>,
    'onChangeFilter' | 'canClearFilter' | 'removeFilter' | 'dataFilter'
>;

export default function TenantHeader({
    dataFilter,
    canClearFilter,
    lastUpdatedAt,
    onChangeFilter,
    removeFilter,
    handleRefresh,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader>
            <AppHeaderGroup>
                <TenantHeaderFilter
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />
            </AppHeaderGroup>

            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <Refresh
                        handleRefresh={handleRefresh}
                        lastTimeUpdated={lastUpdatedAt}
                    />
                    <CreateButton
                        canCreate={true}
                        text={messages('action.create.title', {
                            label: messages('tenant.label'),
                        })}
                        onClick={() => openModal(TYPE_MODAL_TENANT.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
