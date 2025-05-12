import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import RadioComponent from '@/components/ui/radio/filter-radio';
import { TYPE_FILTER } from '@/enums/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useState } from 'react';
import { useGetCountOrderAssignee } from '../../hooks/use-get-count-assignee';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const OrderAssigneeCountDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const [value, setValue] = useState<string>('');
    const [keyword, setKeyword] = useState<string>();

    const { countAssigneeData, isFetching } = useGetCountOrderAssignee(
        dataFilter,
        open || !!dataFilter.assigneeId
    );

    const dataFiltered = countAssigneeData.filter((item) =>
        toNonAccentVietnamese(item.name)
            .toLowerCase()
            .includes(toNonAccentVietnamese(keyword).toLowerCase())
    );

    const selectedUser = countAssigneeData.find(
        (item) => item.id === dataFilter.assigneeId
    );

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            assigneeId: value,
        });
        onCancel();
    };

    if (!dataFilter.assigneeId && !open) return null;

    return (
        <div className="relative">
            {dataFilter.assigneeId && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.ASSIGNEE)}
                    onRemove={() => onChangeFilter({ assigneeId: undefined })}
                >
                    {title}: {selectedUser?.name}
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
                <div className="mt-2 max-h-80 overflow-auto">
                    <RadioComponent
                        searchWords={keyword}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        data={dataFiltered.map((item) => ({
                            name: item.name,
                            value: item.id,
                            count: 0,
                        }))}
                    />
                </div>
            </AppPopover>
        </div>
    );
};

export default OrderAssigneeCountDialog;
