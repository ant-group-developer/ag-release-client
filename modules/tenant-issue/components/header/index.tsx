import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_TENANT_ISSUES } from '../../enums';
import { TenantIssueDataFilter } from '../../types';

type Props = Pick<
    UseFilterProps<TenantIssueDataFilter>,
    'dataFilter' | 'onSearch'
>;

export const TenantIssueHeader = ({ dataFilter, onSearch }: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="px-0 pb-3">
            <AppHeaderGroup>
                <div>
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                </div>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <CreateButton
                        canCreate={true}
                        text={messages('action.create.button')}
                        onClick={() =>
                            openModal(TYPE_MODAL_TENANT_ISSUES.CREATE)
                        }
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
};
