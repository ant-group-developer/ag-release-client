import { AppPopover } from '@/components/shared/app-popover';
import FilterCheckbox from '@/components/ui/checkbox/filter-count-checkbox';
import { Chip } from '@/components/ui/chip';
import { getIntlCodeByStatus } from '@/helpers/common';
import { ORDER_STATUS } from '@/modules/order/enums';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { PRODUCT_MANAGEMENT_TYPE_FILTER } from '../../enum';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: PRODUCT_MANAGEMENT_TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const OrderStatusDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [value, setValue] = useState<string[]>([]);

    // const { countStatusData, isFetching } = useGetCountProductStatus(
    //     dataFilter,
    //     open
    // );

    // const filterStatus = useMemo(() => {
    //     return countStatusData.filter((item) => item.count != 0);
    // }, [countStatusData]);

    const translatedDataFilterStatus = () => {
        if (!dataFilter.status) return '';

        // Split status string into array
        const statusArray = dataFilter.status.split(',');

        // Số lượng status hiển thị trước khi truncate
        const MAX_DISPLAY = 2;

        // Map các status thành tên đã được dịch
        const translatedStatuses = statusArray.map((status: string) =>
            messages(getIntlCodeByStatus(status as ORDER_STATUS))
        );

        if (translatedStatuses.length <= MAX_DISPLAY) {
            return translatedStatuses.join(', ');
        }

        // Nếu có nhiều hơn MAX_DISPLAY items, hiển thị 2 item đầu + số lượng còn lại
        const displayedStatuses = translatedStatuses.slice(0, MAX_DISPLAY);
        const remainingCount = translatedStatuses.length - MAX_DISPLAY;

        return `${displayedStatuses.join(', ')} ... +${remainingCount} ${messages('common.other')}`;
    };

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            status: value,
        });
        onCancel();
    };

    useEffect(() => {
        if (dataFilter.status) {
            setValue(dataFilter.status.split(','));
        } else {
            setValue([]);
        }
    }, [dataFilter.status]);

    if (!dataFilter.status && !open) return null;

    return (
        <div className="relative">
            {dataFilter.status && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(
                            PRODUCT_MANAGEMENT_TYPE_FILTER.STATUS
                        )
                    }
                    onRemove={() => onChangeFilter({ status: undefined })}
                >
                    {title}: {translatedDataFilterStatus()}
                </Chip>
            )}

            <AppPopover
                className="top-[41px] z-50"
                open={open}
                title={title}
                showFooter
                submitProps={{
                    className: value ? '' : 'opacity-50 cursor-not-allowed',
                    disabled: !value,
                    onClick: onSubmit,
                }}
                onCancel={onCancel}
                // loading={isFetching}
            >
                {/* <StatusRadio
                    optionsData={filterStatus}
                    onChange={(e) => setValue(e.target.value)}
                    className="!flex !flex-col"
                /> */}
                <FilterCheckbox
                    data={Object.values(ORDER_STATUS).map((item) => ({
                        name: messages(getIntlCodeByStatus(item)),
                        value: item,
                    }))}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />
            </AppPopover>
        </div>
    );
};

export default OrderStatusDialog;
