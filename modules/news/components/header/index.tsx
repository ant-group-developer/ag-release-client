import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import TableLayoutSegmented from '@/components/ui/semented/table-layout-semented';
import { UseFilterProps } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_NEWS } from '../../enums';
import { NewsDataFilter } from '../../types';
import NewsSuperFilter from './super-filter';

type Props = Pick<
    UseFilterProps<NewsDataFilter>,
    | 'dataFilter'
    | 'onSearch'
    | 'canClearFilter'
    | 'onChangeFilter'
    | 'removeFilter'
>;

export const NewsHeader = ({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    onSearch,
    removeFilter,
}: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();

    return (
        <AppHeader className="app-header">
            <AppHeaderGroup>
                <NewsSuperFilter
                    dataFilter={dataFilter}
                    canClearFilter={canClearFilter}
                    onChangeFilter={onChangeFilter}
                    removeFilter={removeFilter}
                />
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <TableLayoutSegmented
                        className="!mr-2"
                        value={layoutTable}
                        onChange={toggleLayoutTable}
                    />

                    <CreateButton
                        canCreate={true}
                        text={messages('action.create.button')}
                        onClick={() => openModal(TYPE_MODAL_NEWS.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
};
