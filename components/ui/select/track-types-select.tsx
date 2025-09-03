import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleTrackTypes } from '@/modules/track-types/hooks/use-get-list-simple-track-types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'option'> & {
    fallBack?: string;
};

export default function TrackTypesSelect({ fallBack, ...props }: Props) {
    const { trackTypesData } = useGetListSimpleTrackTypes();

    const options = trackTypesData.map((item) => {
        return {
            id: item.id,
            value: item.id,
            label: item.name,
        };
    });

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
