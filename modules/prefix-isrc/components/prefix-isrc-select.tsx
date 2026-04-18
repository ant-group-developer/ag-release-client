import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { toNonAccentVietnamese } from '@/helpers/string';
import { Select, SelectProps } from 'antd';
import { useGetListPrefixIsrc } from '../hooks/use-get-list';
import { PrefixIsrcData } from '../types';

type Props = SelectProps & {
    fallBack?: string;
};

export default function PrefixIsrcSelect({ fallBack, ...props }: Props) {
    const { prefixIsrcData, isFetching } = useGetListPrefixIsrc({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const options = prefixIsrcData?.items?.map((item: PrefixIsrcData) => ({
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
            loading={isFetching}
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
