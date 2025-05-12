import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import RadioComponent from '@/components/ui/radio/filter-radio';
import { LOCALE } from '@/enums/common';
import { getNameByLocale } from '@/helpers/string';
import { STATUS_ASSIGNEE } from '@/modules/order/enums';
import { useGetCountProductType } from '@/modules/product/hooks/use-get-count-type';
import { useLocale } from 'next-intl';
import { useState } from 'react';
import { PRODUCT_MANAGEMENT_TYPE_FILTER } from '../../enum';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: PRODUCT_MANAGEMENT_TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const TypeOrderDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const locale = useLocale();
    const [value, setValue] = useState<string>('');

    const { countTypeData, isFetching } = useGetCountProductType(
        { ...dataFilter, statusAssignee: STATUS_ASSIGNEE.ASSIGNED },
        open || !!dataFilter.productTypeId
    );

    const selectedProductType = countTypeData.find(
        (item) => item.id === dataFilter.productTypeId
    );

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            type: value,
        });
        onCancel();
    };

    if (!dataFilter.productTypeId && !open) return null;

    return (
        <div className="relative">
            {dataFilter.type && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(
                            PRODUCT_MANAGEMENT_TYPE_FILTER.TYPE
                        )
                    }
                    onRemove={() => onChangeFilter({ type: undefined })}
                >
                    {title}:{' '}
                    {getNameByLocale(
                        selectedProductType?.nameEn as string,
                        selectedProductType?.nameVi as string,
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
                    className: value ? '' : 'opacity-50 cursor-not-allowed ',
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
                        data={countTypeData.map((item) => ({
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

export default TypeOrderDialog;
