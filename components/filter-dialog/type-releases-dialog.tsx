import { TYPE_FILTER } from '@/enums/common';
import { getTitleChipDisplay } from '@/helpers/common';
import { RELEASES_TYPE } from '@/modules/releases/enums';
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

export default function TypeReleaseDialog({
    dataFilter,
    open,
    title,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props) {
    const [value, setValue] = useState<string[]>([]);
    const messages = useTranslations();

    const onSubmit = () => {
        onChangeFilter({
            type: value.join(','),
        });
        handleChangeTypeFilter();
    };
    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const displayTitle = getTitleChipDisplay(dataFilter.type, messages);

    useEffect(() => {
        if (dataFilter.type) {
            setValue(dataFilter.type.split(','));
        } else {
            setValue([]);
        }
    }, [dataFilter.type]);

    if (!dataFilter.type && !open) return null;

    return (
        <div className="relative">
            {dataFilter.type && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.TYPE)}
                    onRemove={() => onChangeFilter({ type: undefined })}
                >
                    <CustomTooltip title={displayTitle}>
                        {title}: {displayTitle}
                    </CustomTooltip>
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
                    onClick: () => onSubmit(),
                }}
                onCancel={onCancel}
            >
                <FilterCheckbox
                    data={Object.values(RELEASES_TYPE).map((item) => ({
                        name: item,
                        value: item,
                    }))}
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />
            </AppPopover>
        </div>
    );
}
