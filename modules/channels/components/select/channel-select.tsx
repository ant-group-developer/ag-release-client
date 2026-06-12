import { PAGE_SIZE_LARGE } from '@/constants/page-size';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListChannelForVideo } from '@/modules/channels/hooks/use-get-list-channel-for-video';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function ChannelSelect({ fallBack, ...props }: Props) {
    const { channelsData, isFetching } = useGetListChannelForVideo({
        page: 1,
        pageSize: PAGE_SIZE_LARGE,
    });
    const option =
        channelsData.items?.map((item) => {
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
            loading={isFetching}
        />
    );
}
