import { AppPopover } from '@/components/shared/app-popover';
import FilterCheckbox from '@/components/ui/checkbox/filter-count-checkbox';
import { Chip } from '@/components/ui/chip';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { LOCALE, TYPE_FILTER } from '@/enums/common';
import { getNameByLocale } from '@/helpers/string';
import { useGetProductTypes } from '@/modules/product-types/hooks/use-get-product-types';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const ProductTypeDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const locale = useLocale();
    const messages = useTranslations();
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const { productTypesData, isFetching } = useGetProductTypes();

    const getSelectedProductTypeText = () => {
        if (!dataFilter.productTypeId) return '';

        const typeIds = dataFilter.productTypeId.split(',');
        const selectedNames = typeIds
            .map((id: string) => {
                const type = productTypesData?.items.find(
                    (item) => item.id === id
                );
                return type
                    ? getNameByLocale(type.nameEn, type.nameVi, locale)
                    : null;
            })
            .filter(Boolean) as string[];

        if (selectedNames.length <= 1) return selectedNames[0] || '';

        const [first, second] = selectedNames;
        const remaining = selectedNames.length - 2;

        return remaining > 0
            ? `${first}, ${second}, +${remaining} ${messages('common.other')}`
            : `${first}, ${second}`;
    };

    const handleSubmit = () => {
        onChangeFilter({
            productTypeId:
                selectedTypes.length > 0 ? selectedTypes.join(',') : undefined,
        });
        handleChangeTypeFilter();
    };

    useEffect(() => {
        setSelectedTypes(
            dataFilter.productTypeId ? dataFilter.productTypeId.split(',') : []
        );
    }, [dataFilter.productTypeId]);

    if (!dataFilter.productTypeId && !open) return null;

    return (
        <div className="relative">
            {dataFilter.productTypeId && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(TYPE_FILTER.PRODUCT_TYPE)
                    }
                    onRemove={() =>
                        onChangeFilter({ productTypeId: undefined })
                    }
                >
                    <CustomTooltip title={getSelectedProductTypeText()}>
                        {title}: {getSelectedProductTypeText()}
                    </CustomTooltip>
                </Chip>
            )}

            <AppPopover
                className="top-[41px]"
                open={open}
                title={title}
                showFooter
                submitProps={{
                    className:
                        selectedTypes.length > 0
                            ? ''
                            : 'opacity-50 cursor-not-allowed',
                    disabled: selectedTypes.length === 0,
                    onClick: handleSubmit,
                }}
                onCancel={() => handleChangeTypeFilter()}
                loading={isFetching}
            >
                <div className="mt-2 max-h-80 overflow-auto">
                    <FilterCheckbox
                        value={selectedTypes}
                        onChange={setSelectedTypes}
                        data={
                            productTypesData?.items?.map((item) => ({
                                name:
                                    locale === LOCALE.EN
                                        ? item.nameEn || item.nameVi || ''
                                        : item.nameVi || item.nameEn || '',
                                value: item.id,
                            })) || []
                        }
                    />
                </div>
            </AppPopover>
        </div>
    );
};

export default ProductTypeDialog;
