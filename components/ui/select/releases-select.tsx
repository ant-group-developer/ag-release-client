import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { ReleasesData } from '@/modules/releases/types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function ReleasesSelect({ fallBack, ...props }: Props) {
    const { releasesData } = useGetListReleases({
        pageSize: 999,
    });

    const options = releasesData.items.map((item: ReleasesData) => ({
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
