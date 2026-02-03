import { cn } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimplePermission } from '@/modules/permission/hooks/use-get-list-simple-permission';
import { Select, SelectProps, Spin } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    className?: string;
} & SelectProps;

function PermissionSelect({ className, ...props }: Props) {
    const messages = useTranslations();

    const { permissionData, isFetching } = useGetListSimplePermission();

    const allOption = {
        key: 'all',
        label: messages('common.all'),
        value: 'all',
    };

    const options = permissionData.map((data) => ({
        key: data?.id,
        value: data?.id,
        label: data?.name,
    }));

    const newOptions = isFetching
        ? []
        : props?.mode === 'multiple'
          ? [allOption, ...options]
          : options;

    const handleChange: SelectProps['onChange'] = (value, option) => {
        if (props.mode === 'multiple') {
            if ((value as string[]).includes(allOption.value)) {
                const newValue = options.map((o) => o.value);
                const newOption = options.slice(1);

                props.onChange?.(newValue, newOption);
                return;
            }
        }

        props.onChange?.(value, option);
    };

    const labelRender = (props: any) => {
        const { value, label } = props;

        if (value) {
            return label || value;
        }
        return undefined;
    };

    return (
        <Select
            showSearch
            className={cn('w-full', className)}
            {...props}
            notFoundContent={isFetching ? <Spin spinning size="small" /> : null}
            loading={isFetching}
            onChange={handleChange}
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.label ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={newOptions}
            labelRender={labelRender}
        />
    );
}

export default PermissionSelect;
