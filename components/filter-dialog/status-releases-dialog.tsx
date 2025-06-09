import { TYPE_FILTER } from '@/enums/common';
import {
    getIntlCodeByReleaseStatus,
    getTitleChipDisplay,
} from '@/helpers/common';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { AppPopover } from '../shared/app-popover';
import FilterCheckbox from '../ui/checkbox/filter-count-checkbox';
import { Chip } from '../ui/chip';
import CustomTooltip from '../ui/tooltip/custom-tooltip';

type Props = {
    dataFilter: ReleasesDataFilter;
    open: boolean;
    title: string;
    onChangeFilter: (value: any) => void;
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
};

export default function StatusReleaseDialog({
    dataFilter,
    open,
    title,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props) {
    const messages = useTranslations();
    const [value, setValue] = useState<string[]>([]);

    const onSubmit = () => {
        onChangeFilter({
            status: value,
        });
        handleChangeTypeFilter();
    };
    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const displayTitle = getTitleChipDisplay(dataFilter.status, messages);

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
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.STATUS)}
                    onRemove={() => onChangeFilter({ status: undefined })}
                >
                    <CustomTooltip title={displayTitle}>
                        {title}: {displayTitle}
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
                    onClick: () => onSubmit(),
                }}
                onCancel={onCancel}
            >
                <FilterCheckbox
                    data={Object.values(RELEASES_STATUS).map((item) => ({
                        name: messages(getIntlCodeByReleaseStatus(item)),
                        value: item,
                    }))}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />
            </AppPopover>
        </div>
    );
}
