import FlatList from '@/components/ui/flat-list';
import AppGrid from '@/components/ui/grid/app-grid';
import { Spin } from 'antd';
import { TrackData } from '../../types';
import GridCardTracks from './grid-card';

type Props = {
    data: TrackData[];
    loading?: boolean;
};

export default function TracksGridTable({ data, loading = false }: Props) {
    return (
        <Spin spinning={loading} delay={200}>
            <AppGrid
                className="px-4 py-4"
                style={{
                    // maxHeight: scrollY,
                    overflowY: 'auto',
                }}
            >
                <FlatList
                    data={data}
                    renderItem={({ item }) => <GridCardTracks data={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    // loading={loading}
                    className="contents"
                />
            </AppGrid>
        </Spin>
    );
}
