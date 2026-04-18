import { AppPopover } from '@/components/shared/app-popover';
import FilterCheckbox from '@/components/ui/checkbox/filter-count-checkbox';
import { Chip } from '@/components/ui/chip';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { TYPE_FILTER } from '@/enums/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useGroupListAll } from '@/modules/group/hooks/useGetGroup';
import { GroupData } from '@/modules/group/types/data';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const GroupUserDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [value, setValue] = useState<string[]>([]);
    const [keyword, setKeyword] = useState<string>();

    const { dataGroup, isFetching } = useGroupListAll({
        page: 1,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    // const { creatorUserList, isFetching } = useGetCreatorUserList({
    //     enable: open || !!dataFilter.groupIds,
    // });

    const dataFiltered = dataGroup?.filter((item) =>
        toNonAccentVietnamese(item.name)
            .toLowerCase()
            .includes(toNonAccentVietnamese(keyword).toLowerCase())
    );

    // Thêm hàm để format text hiển thị selected Group
    const getSelectedGroupText = () => {
        if (!dataFilter.groupIds) return '';

        const groupIds = dataFilter.groupIds.split(',');
        const selectedGroup = groupIds
            .map((id: string) => {
                const group = dataGroup?.find(
                    (item: GroupData) => item.id === id
                );
                return group ? group.name : null;
            })
            .filter(Boolean) as string[];

        if (selectedGroup.length === 1) {
            return `${selectedGroup[0]}`;
        }

        // Nếu có nhiều hơn 2 nhóm, hiển thị 2 nhóm đầu tiên + số còn lại
        const otherValid = selectedGroup.length - 2 > 0;
        return `${selectedGroup[0]}, ${selectedGroup[1]} ${otherValid ? `, +${selectedGroup.length - 2} ${messages('common.other')}` : ''} `;
    };

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            groupIds: value,
        });
        onCancel();
    };

    useEffect(() => {
        if (dataFilter.groupIds) {
            setValue(dataFilter.groupIds.split(','));
        } else {
            setValue([]);
        }
    }, [dataFilter.groupIds]);

    if (!dataFilter.groupIds && !open) return null;

    return (
        <div className="relative">
            {dataFilter.groupIds && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.CREATOR)}
                    onRemove={() => onChangeFilter({ groupIds: undefined })}
                >
                    <CustomTooltip title={getSelectedGroupText()}>
                        {title}: {getSelectedGroupText()}
                    </CustomTooltip>
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
                inputProps={{
                    value: keyword,
                    onChange: (e) => setKeyword(e.target.value),
                }}
                showInput
            >
                <div className="mt-2 max-h-80 min-w-[300px] overflow-y-auto">
                    {/* <RadioComponent
                        searchWords={keyword}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        data={dataFiltered.map((item) => ({
                            name: item.name,
                            value: item.id,
                            count: item.count,
                        }))}
                    /> */}
                    <FilterCheckbox
                        searchWords={keyword}
                        data={dataFiltered.map((item) => ({
                            name: item.name,
                            value: item.id,
                        }))}
                        value={value}
                        onChange={(newValue) => setValue(newValue)}
                    />
                </div>
            </AppPopover>
        </div>
    );
};

export default GroupUserDialog;
