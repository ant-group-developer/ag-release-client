import { useGetListTrackOriginTypes } from '@/modules/track-origin-types/hooks/use-get-list-track-origin-types';
import { TrackOriginTypeData } from '@/modules/track-origin-types/types';
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
    const { trackOriginTypesData } = useGetListTrackOriginTypes({
        pageSize: 999,
    });

    const options = trackOriginTypesData.items.map(
        (item: TrackOriginTypeData) => ({
            id: item.id,
            value: item.id,
            label: item.name,
        })
    );

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return <Select {...props} options={options} labelRender={labelRender} />;
}
