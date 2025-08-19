import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { formatCurrency } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListPriceTiers } from '@/modules/price_tiers/hooks/use-get-list-tiers';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function PriceTiersSelect({ fallBack, ...props }: Props) {
    const { priceTiersData } = useGetListPriceTiers({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
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
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.label ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={priceTiersData.items.map((item) => ({
                id: item.id,
                value: item.id,
                label: formatCurrency(item?.amount, item?.currency?.code),
            }))}
            labelRender={labelRender}
        />
    );
}
