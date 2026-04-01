import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { formatCurrency } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListPriceTiers } from '@/modules/price_tiers/hooks/use-get-list-tiers';
import { Select, SelectProps, Typography } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function PriceTiersSelect({ fallBack, ...props }: Props) {
    const { priceTiersData } = useGetListPriceTiers({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const options = priceTiersData.items.map((item) => ({
        id: item.id,
        value: item.id,
        code: item?.code,
        label: (
            <div className="flex flex-col justify-start">
                <Typography.Text>{item?.code}</Typography.Text>
                <Typography.Text className="text-xs" type="secondary">
                    {formatCurrency(item?.amount, item?.currency?.code)}
                </Typography.Text>
            </div>
        ),
    }));

    const labelRender = ({ value }: any) => {
        if (!value) return null;
        if (fallBack) return fallBack;

        const selected = priceTiersData.items.find((opt) => opt.id === value);
        if (!selected) return value;
        return (
            <div className="flex w-full flex-col items-start">
                <span className="font-medium">{selected?.code}</span>
                {/* <span className="text-xs">
                    {formatCurrency(selected?.amount, selected?.currency?.code)}
                </span> */}
            </div>
        );
    };

    return (
        <Select
            {...props}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.code ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={options}
            labelRender={labelRender}
        />
    );
}
