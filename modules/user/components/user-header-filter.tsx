import { PopoverCheckboxFilter } from '@/components/filter/popover-checkbox';
import { PopoverFilterDropdown } from '@/components/filter/popover-dropdown';
import { PopoverInputFilter } from '@/components/filter/popover-input';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { BOOLEAN_RAW, ORDER, TYPE_FILTER } from '@/enums/common';
import { arrayFromString, arrayToString } from '@/helpers/array';
import { flattenData } from '@/helpers/common';
import { UseFilterProps } from '@/hooks/use-filter';
import { TENANT_ORDER_BY } from '@/modules/tenant/enums';
import { useTenantList } from '@/modules/tenant/hooks/use-get-tenant';
import { ListFilter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { USER_TYPE } from '../enums';
import { DataFilterUser } from '../types/data';

type Props = Pick<
    UseFilterProps<DataFilterUser>,
    'dataFilter' | 'onChangeFilter' | 'canClearFilter' | 'removeFilter'
> & {};

export default function UserHeaderFilter({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const messages = useTranslations();

    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>();
    const [inputValue, setInputValue] = useState<string>('');

    const { data: dataTenant } = useTenantList(
        {
            fieldOrder: TENANT_ORDER_BY.NAME,
            orderBy: ORDER.ASC,
            pageSize: 999,
        },
        Boolean(dataFilter.tenantIds) || typeFilter === TYPE_FILTER.WORKSPACE
    );
    const flattenDataTenant = flattenData(dataTenant.items, {});

    const dropdownItems = [
        {
            label: messages('user.search.keyword'),
            visible: !dataFilter.keyword,
            onClick: () => setTypeFilter(TYPE_FILTER.KEYWORD),
        },
        {
            label: messages('user.search.id'),
            visible: !dataFilter.id,
            onClick: () => setTypeFilter(TYPE_FILTER.ID),
        },
        {
            label: messages('user.type'),
            visible: !dataFilter.type,
            onClick: () => setTypeFilter(TYPE_FILTER.TYPE),
        },
        {
            label: messages('tenant.label'),
            visible: !dataFilter.type,
            onClick: () => setTypeFilter(TYPE_FILTER.WORKSPACE),
        },
        {
            label: messages('status.label'),
            visible: !dataFilter.status,
            onClick: () => setTypeFilter(TYPE_FILTER.STATUS),
        },
    ];

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
        <div ref={ref} className="relative flex w-full gap-1">
            <button
                className="h-10 text-2xl"
                onClick={() => setTypeFilter(TYPE_FILTER.DROPDOWN)}
            >
                <CustomTooltip title={messages('common.filter')}>
                    <ListFilter />
                </CustomTooltip>
            </button>

            <div className="flex flex-1 flex-wrap items-center gap-1">
                <PopoverInputFilter
                    open={typeFilter === TYPE_FILTER.KEYWORD}
                    title={messages('user.search.keyword')}
                    initialValue={dataFilter.keyword}
                    onOpenChange={(val) =>
                        setTypeFilter(val ? TYPE_FILTER.KEYWORD : undefined)
                    }
                    onConfirm={(val) => onChangeFilter({ keyword: val })}
                    onRemove={() => onChangeFilter({ keyword: undefined })}
                />
                <PopoverInputFilter
                    open={typeFilter === TYPE_FILTER.ID}
                    title={messages('user.search.id')}
                    initialValue={dataFilter.id}
                    onOpenChange={(val) =>
                        setTypeFilter(val ? TYPE_FILTER.ID : undefined)
                    }
                    onConfirm={(val) => onChangeFilter({ id: val })}
                    onRemove={() => onChangeFilter({ id: undefined })}
                />
                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.TYPE}
                    title={messages('user.type')}
                    options={[
                        {
                            name: messages('user.admin'),
                            value: USER_TYPE.ADMIN,
                        },
                        {
                            name: messages('user.user'),
                            value: USER_TYPE.USER,
                        },
                    ]}
                    selectedValues={arrayFromString(dataFilter.type)}
                    onOpenChange={(val) =>
                        setTypeFilter(val ? TYPE_FILTER.TYPE : undefined)
                    }
                    onConfirm={(vals) =>
                        onChangeFilter({ type: arrayToString(vals) })
                    }
                    onRemove={() => onChangeFilter({ type: undefined })}
                />
                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.WORKSPACE}
                    title={messages('tenant.label')}
                    options={flattenDataTenant.map((item) => ({
                        name: item.name,
                        value: item.id,
                    }))}
                    selectedValues={arrayFromString(dataFilter.tenantIds)}
                    onOpenChange={(val) =>
                        setTypeFilter(val ? TYPE_FILTER.WORKSPACE : undefined)
                    }
                    onConfirm={(vals) =>
                        onChangeFilter({ tenantIds: arrayToString(vals) })
                    }
                    onRemove={() => onChangeFilter({ tenantIds: undefined })}
                />
                <PopoverCheckboxFilter
                    open={typeFilter === TYPE_FILTER.STATUS}
                    title={messages('status.label')}
                    options={[
                        {
                            name: messages('status.active'),
                            value: BOOLEAN_RAW.TRUE.toString(),
                        },
                        {
                            name: messages('status.block'),
                            value: BOOLEAN_RAW.FALSE.toString(),
                        },
                    ]}
                    selectedValues={arrayFromString(dataFilter.status)}
                    onOpenChange={(val) =>
                        setTypeFilter(val ? TYPE_FILTER.STATUS : undefined)
                    }
                    onConfirm={(vals) =>
                        onChangeFilter({ status: arrayToString(vals) })
                    }
                />

                <div className="grow">
                    <PopoverFilterDropdown
                        open={typeFilter === TYPE_FILTER.DROPDOWN}
                        title={messages('common.filter')}
                        options={dropdownItems}
                        value={inputValue}
                        onInputChange={setInputValue}
                        onSearch={() => onChangeFilter({ keyword: inputValue })}
                        onOpenChange={() => setTypeFilter(undefined)}
                        placeholder={messages('common.filter')}
                    />
                </div>
            </div>
            {canClearFilter && (
                <div className="flex items-center">
                    <CustomTooltip title={messages('common.removeFilter')}>
                        <IconButton
                            className="clear-filter-btn"
                            onClick={removeFilter}
                        >
                            <X size={SIZE_ICON} />
                        </IconButton>
                    </CustomTooltip>
                </div>
            )}
        </div>
    );
}
