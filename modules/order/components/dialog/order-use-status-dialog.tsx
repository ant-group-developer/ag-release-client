import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import UseStatusRadio from '@/components/ui/radio/use-status-radio';
import { TYPE_FILTER } from '@/enums/common';
import { USED_STATUS } from '@/modules/order/enums';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useGetCountUseStatus } from '../../hooks/use-get-count-use-status';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const OrderUseStatusDialog = <T extends Record<string, any>>({
    open,
    title,
    handleChangeTypeFilter,
    dataFilter,
    onChangeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [value, setValue] = useState<string>('');

    const { useStatusCountData, isFetching } = useGetCountUseStatus(
        dataFilter,
        open
    );

    const filterStatus = useMemo(() => {
        return useStatusCountData.filter((item) => item.count != 0);
    }, [useStatusCountData]);

    const translatedDataFilterStatus = () => {
        switch (dataFilter.usedStatus) {
            case USED_STATUS.USED:
                return messages('common.used');

            case USED_STATUS.NOT_USED:
                return messages('common.notUsed');

            default:
                return messages('common.unknown');
        }
    };

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            usedStatus: value,
        });
        onCancel();
    };

    if (!dataFilter.usedStatus && !open) return null;

    return (
        <div className="relative">
            {dataFilter.usedStatus && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(TYPE_FILTER.USE_STATUS)
                    }
                    onRemove={() => onChangeFilter({ usedStatus: undefined })}
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
                <UseStatusRadio
                    optionsData={filterStatus}
                    onChange={(e) => setValue(e.target.value)}
                    className="!flex !flex-col"
                />
            </AppPopover>
        </div>
    );
};

export default OrderUseStatusDialog;
