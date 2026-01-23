import { toNonAccentVietnamese } from '@/helpers/string';
import { Select, SelectProps } from 'antd';
import { useGetListDealType } from '../../hooks/use-get-list';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function DspTypeSelect({ fallBack, ...props }: Props) {
    const { dealTypeData } = useGetListDealType({
        pageSize: 999,
    });

    const options = dealTypeData?.items.map((item) => ({
        id: item.id,
        value: item.id,
        name: item?.name,
        label: <span>{item?.name}</span>,
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
