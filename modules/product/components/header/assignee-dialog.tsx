import { AppPopover } from '@/components/shared/app-popover';
import FilterCheckbox from '@/components/ui/checkbox/filter-count-checkbox';
import { Chip } from '@/components/ui/chip';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { TYPE_FILTER } from '@/enums/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useUserList } from '@/modules/user/hooks/use-get-user';
import { UserData } from '@/modules/user/types/data';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

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
    const messages = useTranslations();
    const [value, setValue] = useState<string[]>([]);
    const [keyword, setKeyword] = useState<string>();

    const { data, isFetching } = useUserList({ page: 1, pageSize: 999 });
    const dataFiltered = data?.items.filter((item) =>
        toNonAccentVietnamese(item.name)
            .toLowerCase()
            .includes(toNonAccentVietnamese(keyword).toLowerCase())
    );

    // Thêm hàm để format text hiển thị selected users
    const getSelectedUsersText = () => {
        if (!dataFilter.assigneeId) return '';

        const assigneeId = dataFilter.assigneeId.split(',');
        const selectedUsers = assigneeId
            .map((id: string) => {
                const user = data?.items?.find(
                    (item: UserData) => item.id === id
                );
                return user ? user.name : null;
            })
            .filter(Boolean) as string[];

        if (selectedUsers.length === 1) {
            return `${selectedUsers[0]}`;
        }

        // Nếu có nhiều hơn 2 người dùng, hiển thị 2 người đầu tiên + số còn lại
        const otherValid = selectedUsers.length - 2 > 0;
        return `${selectedUsers[0]}, ${selectedUsers[1]} ${otherValid ? `, +${selectedUsers.length - 2} ${messages('common.other')}` : ''} `;
    };

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            assigneeId: value.join(','),
        });
        onCancel();
    };

    useEffect(() => {
        if (dataFilter.assigneeId) {
            setValue(dataFilter.assigneeId.split(','));
        } else {
            setValue([]);
        }
    }, [dataFilter.assigneeId]);

    if (!dataFilter.assigneeId && !open) return null;

    return (
        <div className="relative">
            {dataFilter.assigneeId && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.ASSIGNEE)}
                    onRemove={() => onChangeFilter({ assigneeId: undefined })}
                >
                    <CustomTooltip title={getSelectedUsersText()}>
                        {title}: {getSelectedUsersText()}
                    </CustomTooltip>
                </Chip>
            )}

            <AppPopover
                className="top-[41px]"
                open={open}
                title={title}
                showFooter
                submitProps={{
                    className: value.length
                        ? ''
                        : 'opacity-50 cursor-not-allowed',
                    disabled: !value.length,
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
                <div className="mt-2 max-h-80 overflow-y-auto">
                    <FilterCheckbox
                        searchWords={keyword}
                        data={dataFiltered?.map((item: UserData) => ({
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

export default OrderAssigneeCountDialog;
