import { PAGE_SIZE_DEFAULT } from '@/constants/page-size';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListTracks } from '@/modules/tracks/hooks/use-get-list-tracks';
import { TrackData } from '@/modules/tracks/types';
import { Select, SelectProps } from 'antd';
import { Key, useMemo } from 'react';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
    releasesIds?: string[];
    idInclude?: string | string[] | Key[];
};

export default function TracksSelect({
    releasesIds,
    fallBack,
    idInclude,
    ...props
}: Props) {
    const normalizedIdInclude = useMemo(() => {
        if (!idInclude) return undefined;
        if (Array.isArray(idInclude)) {
            const validIds = idInclude.filter(Boolean).map(String);
            return validIds.length > 0 ? validIds.join(',') : undefined;
        }
        return String(idInclude);
    }, [idInclude]);

    const { tracksData, isFetching } = useGetListTracks({
        pageSize: PAGE_SIZE_DEFAULT,
        idInclude: normalizedIdInclude,
    });

    const options = tracksData.items.map((item: TrackData) => ({
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
            loading={isFetching || props.loading}
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
