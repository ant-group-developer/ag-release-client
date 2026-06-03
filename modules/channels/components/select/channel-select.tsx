import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleChannel } from '@/modules/channels/hooks/use-get-list-simple-channel';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function ChannelSelect({ fallBack, ...props }: Props) {
    const { channelsData } = useGetListSimpleChannel();
    const option =
        channelsData?.map((item) => {
            return {
                id: item.id,
                value: item.id,
                label: item?.name,
                name: item?.name,
            };
        }) || [];

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
            filterOption={(input, option: any) =>
                toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={option}
            labelRender={labelRender}
        />
    );
}
