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

    const options = priceTiersData.items.map((item) => ({
        id: item.id,
        value: item.id,
        code: item?.code,
        label: (
            <div className="flex items-center gap-1">
                <span>
                    {formatCurrency(item?.amount, item?.currency?.code)}
                </span>
                <span
                    style={{
                        fontWeight: 500,
                    }}
                >
                    {item?.code}
                </span>
            </div>
        ),
    }));

    const labelRender = ({ value }: any) => {
        if (!value) return null;
        if (fallBack) return fallBack;

        const selected = options.find((opt) => opt.value === value);
        return selected?.label ?? value;
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
