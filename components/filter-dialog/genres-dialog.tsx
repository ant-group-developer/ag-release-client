import { TYPE_FILTER } from '@/enums/common';
import { getTitleChipDisplay } from '@/helpers/common';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { GENRES } from '@/modules/tracks/enums';
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

export default function GenresReleaseDialog({
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
            genres: value,
        });
        handleChangeTypeFilter();
    };
    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const displayTitle = getTitleChipDisplay(dataFilter.genres, messages);

    useEffect(() => {
        if (dataFilter.genres) {
            setValue(dataFilter.genres.split(','));
        } else {
            setValue([]);
        }
    }, [dataFilter.genres]);

    if (!dataFilter.genres && !open) return null;

    return (
        <div className="relative">
            {dataFilter.genres && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.GENRES)}
                    onRemove={() => onChangeFilter({ genres: undefined })}
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
                    data={Object.values(GENRES).map((item) => ({
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
