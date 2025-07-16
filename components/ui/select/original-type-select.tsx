import { useGetListTrackOriginTypes } from '@/modules/track-origin-types/hooks/use-get-list-track-origin-types';
import { TrackOriginTypeData } from '@/modules/track-origin-types/types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {};

export enum OriginType {
    ORIGINAL = 'original',
    COVER = 'cover',
    REMIX = 'remix',
}

export default function OriginalTypeSelect({ ...props }: Props) {
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

    return <Select {...props} options={options} />;
}
