import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { cn } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useGroupListAll } from '../hooks/useGetGroup';

type Props = {} & SelectProps;

function GroupSelect({ className, ...props }: Props) {
    const messages = useTranslations();
    const { dataGroup } = useGroupListAll({
        page: 1,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const allOption = {
        label: messages('common.all'),
        value: 'all',
    };

    const options = dataGroup.map((data) => ({
        label: data.name,
        value: data.id,
    }));

    const newOptions =
        props?.mode === 'multiple' ? [allOption, ...options] : options;

    const handleChange: Props['onChange'] = (value, option) => {
        if (props.mode === 'multiple') {
            if ((value as string[]).includes(allOption.value)) {
                return props.onChange?.(
                    options.map((o) => o.value),
                    options.slice(1)
                );
            }
        }
        return props.onChange?.(value, option);
    };

    const filterOption: SelectProps['filterOption'] = (input, option) =>
        toNonAccentVietnamese((option?.label as string) ?? '')
            .toLowerCase()
            .includes(toNonAccentVietnamese(input ?? '').toLowerCase());

    return (
        <Select
            showSearch
            placeholder={messages('group.select')}
            {...props}
            className={cn('w-full', className)}
            options={newOptions}
            filterOption={filterOption}
            onChange={handleChange}
        />
    );
}

export default GroupSelect;
