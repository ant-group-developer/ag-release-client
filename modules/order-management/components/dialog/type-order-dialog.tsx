import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import TypeRadio from '@/components/ui/radio/type-radio';
import { getIntlCodeByTypeUpload } from '@/helpers/common';
import { useGetCountOrderType } from '@/modules/order/hooks/use-get-count-type';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ORDER_MANAGEMENT_TYPE_FILTER } from '../../enum';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: ORDER_MANAGEMENT_TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const TypeDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [value, setValue] = useState<string>('');

    const { countTypeData, isFetching } = useGetCountOrderType(
        dataFilter,
        open
    );

    const translatedDataFilterStatus = () => {
        return messages(getIntlCodeByTypeUpload(dataFilter?.type));
    };

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            type: value,
        });
        onCancel();
    };

    if (!dataFilter.type && !open) return null;

    return (
        <div className="relative">
            {dataFilter.type && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(
                            ORDER_MANAGEMENT_TYPE_FILTER.TYPE
                        )
                    }
                    onRemove={() => onChangeFilter({ type: undefined })}
                >
                    {title}: {translatedDataFilterStatus()}
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
                <TypeRadio
                    optionsData={countTypeData}
                    onChange={(e) => setValue(e.target.value)}
                    className="!flex !flex-col"
                />
            </AppPopover>
        </div>
    );
};

export default TypeDialog;
