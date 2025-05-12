import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import RadioComponent from '@/components/ui/radio/filter-radio';
import { LOCALE, TYPE_FILTER } from '@/enums/common';
import { getNameByLocale } from '@/helpers/string';
import { useCountPriorities } from '@/modules/priorities/hooks/use-get-count-priorities';
import { useLocale } from 'next-intl';
import { useState } from 'react';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const OrderPriorityDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const [value, setValue] = useState<string>('');
    const locale = useLocale();

    const { countPrioritiesData, isFetching } = useCountPriorities(
        dataFilter,
        open || !!dataFilter.priorityId
    );

    const selectedPriority = countPrioritiesData.find(
        (item) => item.id === dataFilter.priorityId
    );

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            priorityId: value,
        });
        onCancel();
    };

    if (!dataFilter.priorityId && !open) return null;

    return (
        <div className="relative">
            {dataFilter.priorityId && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.PRIORITY)}
                    onRemove={() => onChangeFilter({ priorityId: undefined })}
                >
                    {title}:
                    {getNameByLocale(
                        selectedPriority?.nameEn as string,
                        selectedPriority?.nameVi as string,
                        locale
                    )}
                </Chip>
            )}

            <AppPopover
                className="top-[41px]"
                open={open}
                title={title}
                showFooter
                submitProps={{
                    className: value ? '' : 'opacity-50 cursor-not-allowed',
                    disabled: !value,
                    onClick: onSubmit,
                }}
                onCancel={onCancel}
                loading={isFetching}
            >
                <div className="mt-2 max-h-80 overflow-auto">
                    <RadioComponent
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        data={countPrioritiesData.map((item) => ({
                            name:
                                locale === LOCALE.EN
                                    ? item.nameEn || item.nameVi || ''
                                    : item.nameVi || item.nameEn || '',
                            value: item.id,
                            count: item.count,
                        }))}
                    />
                </div>
            </AppPopover>
        </div>
    );
};

export default OrderPriorityDialog;
