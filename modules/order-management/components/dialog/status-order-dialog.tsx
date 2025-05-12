import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import StatusRadio from '@/components/ui/radio/status-radio';
import { getIntlCodeByStatus } from '@/helpers/common';
import { useGetCountOrderStatus } from '@/modules/order/hooks/use-get-count-status';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { ORDER_MANAGEMENT_TYPE_FILTER } from '../../enum';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: ORDER_MANAGEMENT_TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const StatusDialog = <T extends Record<string, any>>({
    open,
    title,
    handleChangeTypeFilter,
    dataFilter,
    onChangeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [value, setValue] = useState<string>('');

    const { countStatusData, isFetching } = useGetCountOrderStatus(
        dataFilter,
        open
    );

    const filterStatus = useMemo(() => {
        return countStatusData.filter((item) => item.count != 0);
    }, [countStatusData]);

    const translatedDataFilterStatus = () => {
        return messages(getIntlCodeByStatus(dataFilter?.status));
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

    if (!dataFilter.status && !open) return null;

    return (
        <div className="relative">
            {dataFilter.status && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(
                            ORDER_MANAGEMENT_TYPE_FILTER.STATUS
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
                loading={isFetching}
            >
                <StatusRadio
                    optionsData={filterStatus}
                    onChange={(e) => setValue(e.target.value)}
                    className="!flex !flex-col"
                />
            </AppPopover>
        </div>
    );
};

export default StatusDialog;
