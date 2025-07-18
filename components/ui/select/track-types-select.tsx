import { useGetListTrackTypes } from '@/modules/track-types/hooks/use-get-list-track-types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'option'> & {};

export default function TrackTypesSelect({ ...props }: Props) {
    const { trackTypesData } = useGetListTrackTypes({});

    const options = trackTypesData.items.map((item) => {
        return {
            id: item.id,
            value: item.id,
            label: item.name,
        };
    });

    return <Select {...props} options={options} />;
}
