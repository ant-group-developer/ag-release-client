import { AppPopover } from '@/components/shared/app-popover';
import FilterCheckbox from '@/components/ui/checkbox/filter-count-checkbox';
import { Chip } from '@/components/ui/chip';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { LOCALE, TYPE_FILTER } from '@/enums/common';
import { useGetPriorityList } from '@/modules/priorities/hooks/use-get-priority';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const PriorityDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const locale = useLocale();
    const [value, setValue] = useState<string[]>([]);
    const messages = useTranslations();

    const { priorityData, isFetching } = useGetPriorityList(
        open || !!dataFilter.priorityId
    );

    const selectedPriority = priorityData?.items.find(
        (item) => item.id === dataFilter.priorityId
    );

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            priorityId: value.join(','),
        });
        onCancel();
    };

    const getSelectedPriorityText = () => {
        if (!dataFilter.priorityId) return '';

        const priorityIds = dataFilter.priorityId.split(',');
        const selectedPriorities = priorityIds
            .map((id: string) => {
                const priority = priorityData?.items.find(
                    (item) => item.id === id
                );
                return priority
                    ? locale === LOCALE.EN
                        ? priority.nameEn || priority.nameVi
                        : priority.nameVi || priority.nameEn
                    : null;
            })
            .filter(Boolean) as string[];

        if (selectedPriorities.length === 1) {
            return selectedPriorities[0];
        }

        // Nếu có nhiều hơn 2 loại, hiển thị 2 loại đầu + số còn lại
        const remainingCount = selectedPriorities.length - 2;
        const otherValid = remainingCount > 0;
        return `${selectedPriorities[0]}, ${selectedPriorities[1]} ${otherValid ? `, +${remainingCount} ${messages('common.other')}` : ''} `;
    };

    useEffect(() => {
        if (dataFilter.priorityId) {
            setValue(dataFilter.priorityId.split(','));
        } else {
            setValue([]);
        }
    }, [dataFilter.priorityId]);

    if (!dataFilter.priorityId && !open) return null;

    return (
        <div className="relative">
            {dataFilter.priorityId && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.PRIORITY)}
                    onRemove={() => onChangeFilter({ priorityId: undefined })}
                >
                    <CustomTooltip title={getSelectedPriorityText()}>
                        {title}: {getSelectedPriorityText()}
                    </CustomTooltip>
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
                    <FilterCheckbox
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                        data={priorityData?.items.map((item) => ({
                            name:
                                locale === LOCALE.EN
                                    ? item.nameEn || item.nameVi || ''
                                    : item.nameVi || item.nameEn || '',
                            value: item.id,
                        }))}
                    />
                </div>
            </AppPopover>
        </div>
    );
};

export default PriorityDialog;
