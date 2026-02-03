import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleTenant } from '@/modules/tenant/hooks/use-get-simple-list';
import { Select, SelectProps } from 'antd';
import { useLocale } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function TenantSelect({ fallBack, ...props }: Props) {
    const { tenantSimpleData, isFetching } = useGetListSimpleTenant();
    const locale = useLocale();

    const options = tenantSimpleData.map((item) => ({
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
            loading={isFetching || props?.loading}
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
