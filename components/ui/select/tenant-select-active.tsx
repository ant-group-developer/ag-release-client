import { toNonAccentVietnamese } from '@/helpers/string';
import { useTenantActiveAccessible } from '@/modules/tenant/hooks/use-get-tenant';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function TenantSelectActive({ fallBack, ...props }: Props) {
    const { data, isLoading } = useTenantActiveAccessible();

    const options = (data?.items || []).map((item) => ({
        id: item.id,
        value: item.id,
        name: item?.name,
        label: (
            <p className="flex items-center justify-between gap-1">
                <span>{item?.name}</span>
            </p>
        ),
    }));

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            {...props}
            showSearch
            loading={isLoading || props?.loading}
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={options}
            labelRender={labelRender}
        />
    );
}
