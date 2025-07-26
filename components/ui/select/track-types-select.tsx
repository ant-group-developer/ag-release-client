import { useGetListTrackTypes } from '@/modules/track-types/hooks/use-get-list-track-types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'option'> & {
    fallBack?: string;
};

export default function TrackTypesSelect({ fallBack, ...props }: Props) {
    const { trackTypesData } = useGetListTrackTypes({});

    const options = trackTypesData.items.map((item) => {
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

    return <Select {...props} options={options} labelRender={labelRender} />;
}
