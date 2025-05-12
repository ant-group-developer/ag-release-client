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

const OrderCreatorCountDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [value, setValue] = useState<string[]>([]);
    const [keyword, setKeyword] = useState<string>();

    // const { creatorCountData, isFetching } = useGetProductCreatorCount(
    //     dataFilter,
    //     open || !!dataFilter.creatorId
    // );

    const { data, isFetching } = useUserList({ page: 1, pageSize: 999 });
    const dataFiltered = data?.items.filter((item) =>
        toNonAccentVietnamese(item.name)
            .toLowerCase()
            .includes(toNonAccentVietnamese(keyword).toLowerCase())
    );

    // Thêm hàm để format text hiển thị selected users
    const getSelectedUsersText = () => {
        if (!dataFilter.creatorId) return '';

        const creatorIds = dataFilter.creatorId.split(',');
        const selectedUsers = creatorIds
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
            creatorId: value,
        });
        onCancel();
    };

    useEffect(() => {
        if (dataFilter.creatorId) {
            setValue(dataFilter.creatorId.split(','));
        } else {
            setValue([]);
        }
    }, [dataFilter.creatorId]);

    if (!dataFilter.creatorId && !open) return null;

    return (
        <div className="relative">
            {dataFilter.creatorId && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.CREATOR)}
                    onRemove={() => onChangeFilter({ creatorId: undefined })}
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
                <div className="mt-2 max-h-80 overflow-y-auto">
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
                        data={dataFiltered.map((item: UserData) => ({
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

export default OrderCreatorCountDialog;
