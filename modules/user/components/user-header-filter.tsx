import { PopoverCheckboxFilter } from '@/components/filter/popover-checkbox';
import { PopoverFilterDropdown } from '@/components/filter/popover-dropdown';
import { PopoverInputFilter } from '@/components/filter/popover-input';
import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { TYPE_FILTER } from '@/enums/common';
import { arrayFromString, arrayToString } from '@/helpers/array';
import { UseFilterProps } from '@/hooks/use-filter';
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
                <ListFilter />
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
