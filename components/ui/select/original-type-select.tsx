import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleTrackOriginTypes } from '@/modules/track-origin-types/hooks/use-get-list-simple-track-origin-types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export enum OriginType {
    ORIGINAL = 'original',
    COVER = 'cover',
    REMIX = 'remix',
}

export default function OriginalTypeSelect({ fallBack, ...props }: Props) {
    const { trackOriginTypesData } = useGetListSimpleTrackOriginTypes();

    const options = trackOriginTypesData.map((item) => ({
        id: item.id,
        value: item.id,
        label: item.name,
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
