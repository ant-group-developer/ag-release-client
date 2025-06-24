import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { CountryDataFilter } from '../../types';
import CountrySuperFilter from './country-super-filter';

// TODO: Tạo CountriesSuperFilter nếu cần

type Props = {
    dataFilter: CountryDataFilter;
    onChangeFilter: OnChangeFilter<CountryDataFilter>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
    handleRefresh: () => void;
};

export default function CountriesHeader({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
    handleRefresh,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="px-4 py-1">
            <AppHeaderGroup>
                <CountrySuperFilter
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <CreateButton
                        canCreate={true}
                        text="Thêm quốc gia"
                        onClick={() => openModal && openModal('CREATE_COUNTRY')}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
