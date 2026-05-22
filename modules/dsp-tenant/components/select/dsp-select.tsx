import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { toNonAccentVietnamese } from '@/helpers/string';
import { Select, SelectProps } from 'antd';
import { useGetListDsp } from '../../hooks/use-get-list-dsp';
import { DspData } from '../../types';

type Props = SelectProps & {
    fallBack?: string;
};

export default function DspSelect({ fallBack, ...props }: Props) {
    const { dspData } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const options = dspData?.items?.map((item: DspData) => ({
        id: item?.id,
        value: item?.id,
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
