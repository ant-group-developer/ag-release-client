import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import IsActiveRadio from '@/components/ui/radio/is-active-radio';
import { ACTIVE_TYPE, TYPE_FILTER } from '@/enums/common';
import { useGetActiveCount } from '@/modules/topic/hooks/use-get-active-count';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const IsActiveDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [value, setValue] = useState<string>('');
    const { activeCountData, isFetching } = useGetActiveCount(dataFilter, open);

    const translatedDataFilterStatus = () => {
        switch (dataFilter.isActive) {
            case ACTIVE_TYPE.ON:
                return messages('status.on');

            case ACTIVE_TYPE.OFF:
                return messages('status.off');

            default:
                break;
        }
    };

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            isActive: value,
        });
        onCancel();
    };

    return (
        <div className="relative">
            {dataFilter.isActive && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(TYPE_FILTER.IS_ACTIVE)
                    }
                    onRemove={() => onChangeFilter({ isActive: undefined })}
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
                <IsActiveRadio
                    data={activeCountData}
                    onChange={(e) => setValue(e.target.value)}
                    className="!flex !flex-col"
                />
            </AppPopover>
        </div>
    );
};

export default IsActiveDialog;
