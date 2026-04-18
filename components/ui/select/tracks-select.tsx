import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { toNonAccentVietnamese } from '@/helpers/string';
import { ReleasesData } from '@/modules/releases/types';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
    releasesIds?: string[];
};

export default function TracksSelect({
    releasesIds,
    fallBack,
    ...props
}: Props) {
    const { tracksData } = useGetListTracks({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const options = tracksData.items.map((item: ReleasesData) => ({
        id: item.id,
        value: item.id,
        label: item.title,
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
                toNonAccentVietnamese(option?.label ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={options}
            labelRender={labelRender}
        />
    );
}
