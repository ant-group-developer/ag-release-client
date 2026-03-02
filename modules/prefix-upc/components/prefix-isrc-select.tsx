import { toNonAccentVietnamese } from '@/helpers/string';
import { Select, SelectProps } from 'antd';
import { useGetListPrefixUpc } from '../hooks/use-get-list';
import { PrefixUpcData } from '../types';

type Props = SelectProps & {
    fallBack?: string;
};

export default function PrefixUpcSelect({ fallBack, ...props }: Props) {
    const { prefixUpcData } = useGetListPrefixUpc({
        pageSize: 999,
    });

    const options = prefixUpcData?.items?.map((item: PrefixUpcData) => ({
        id: item?.id,
        value: item?.id,
        name: item?.code,
        label: <span>{item?.code}</span>,
    }));

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            labelRender={labelRender}
            {...props}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={options}
        />
    );
}
