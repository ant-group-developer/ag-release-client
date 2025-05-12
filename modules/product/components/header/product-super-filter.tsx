import ApproverDialog from '@/components/filter-dialog/approver-dialog';
import AssigneeDialog from '@/components/filter-dialog/assignee-dialog';
import CreatorDialog from '@/components/filter-dialog/creator-dialog';
import DateCreatedDialog from '@/components/filter-dialog/date-create-dialog';
import DateDeadlineDialog from '@/components/filter-dialog/date-deadline-dialog';
import GroupUserDialog from '@/components/filter-dialog/group-user-dialog';
import PriorityDialog from '@/components/filter-dialog/priority-dialog';
import StatusDialog from '@/components/filter-dialog/status-dialog';
import TopicDialog from '@/components/filter-dialog/topic-dialog';
import SearchDialog from '@/components/shared/search-dialog';
import IconButton from '@/components/ui/button/icon-button';
import { OnSearchType } from '@/components/ui/input/search';
import { SIZE_ICON } from '@/constants/common';
import { TYPE_FILTER } from '@/enums/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { OpenModalProps } from '@/hooks/use-modal';
import { Tooltip } from 'antd';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import ProductTypeDialog from '../../../../components/filter-dialog/product-type-dialog';
import { TYPE_MODAL_PRODUCT } from '../../enums';
import { DataFilterProduct, ProductData } from '../../types';
import { ProductHeaderDropdown } from '../dropdown/product-header-dropdown';

type Props = {
    dataFilter: DataFilterProduct;
    openModal: OpenModalProps<TYPE_MODAL_PRODUCT, ProductData>;
    onSearch: OnSearchType;
    onChangeFilter: OnChangeFilter<DataFilterProduct>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function ProductSuperFilter({
    openModal,
    dataFilter,
    onSearch,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const messages = useTranslations();

    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>();

    const handleChangeTypeFilter = (value?: TYPE_FILTER) =>
        setTypeFilter(value);

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            const isClickOnClearButton =
                event.target.closest('.clear-filter-btn') !== null;
            if (ref.current?.contains(event.target)) {
                if (isClickOnClearButton) {
                    return;
                }
                const chipList = document.getElementsByClassName('chip-filter');
                if (
                    !typeFilter &&
                    !Array.from(chipList).some((chip) =>
                        chip.contains(event.target)
                    )
                ) {
                    setTypeFilter(TYPE_FILTER.DROPDOWN);
                }
            } else {
                setTypeFilter(undefined);
            }
        };
        window.addEventListener('mousedown', handleOutSideClick);
        return () => {
            window.removeEventListener('mousedown', handleOutSideClick);
        };
    }, [ref, typeFilter]);

    return (
        <div ref={ref} className="relative flex w-full">
            <button
                className="h-10 px-2 text-2xl"
                onClick={() => setTypeFilter(TYPE_FILTER.DROPDOWN)}
            >
                <ListFilter />
            </button>

            <div className="flex flex-1 flex-wrap gap-1">
                <DateDeadlineDialog
                    title={messages('common.deadline')}
                    open={typeFilter === TYPE_FILTER.DEADLINE}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <SearchDialog
                    title={messages('form.searchPlaceholder')}
                    open={typeFilter === TYPE_FILTER.KEYWORD}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <StatusDialog
                    title={messages('common.status')}
                    open={typeFilter === TYPE_FILTER.STATUS}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <TopicDialog
                    title={messages('topic.label')}
                    open={typeFilter === TYPE_FILTER.TOPIC}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                {/* <OrderCreatorCountDialog
                    title={messages('common.userCreator')}
                    open={typeFilter === TYPE_FILTER.CREATOR}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                /> */}

                <CreatorDialog
                    title={messages('common.userCreator')}
                    open={typeFilter === TYPE_FILTER.CREATOR}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <AssigneeDialog
                    title={messages('common.assignee')}
                    open={typeFilter === TYPE_FILTER.ASSIGNEE}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <ApproverDialog
                    title={messages('common.approver')}
                    open={typeFilter === TYPE_FILTER.APPROVER}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <GroupUserDialog
                    title={messages('order.groupCreator')}
                    open={typeFilter === TYPE_FILTER.GROUP}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <ProductTypeDialog
                    title={messages('product.type')}
                    open={typeFilter === TYPE_FILTER.PRODUCT_TYPE}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <DateCreatedDialog
                    title={messages('common.dateCreated')}
                    open={typeFilter === TYPE_FILTER.DATE_CREATED}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <PriorityDialog
                    title={messages('priority.label')}
                    open={typeFilter === TYPE_FILTER.PRIORITY}
                    handleChangeTypeFilter={handleChangeTypeFilter}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                />

                <div className="grow">
                    <ProductHeaderDropdown
                        dataFilter={dataFilter}
                        handleChangeTypeFilter={handleChangeTypeFilter}
                        open={typeFilter === TYPE_FILTER.DROPDOWN}
                        onChangeFilter={onChangeFilter}
                    />
                </div>
            </div>
            {canClearFilter && (
                <div>
                    <Tooltip title={messages('common.removeFilter')}>
                        <IconButton
                            className="clear-filter-btn"
                            onClick={removeFilter}
                        >
                            <X size={SIZE_ICON} />
                        </IconButton>
                    </Tooltip>
                </div>
            )}
        </div>
    );
}
