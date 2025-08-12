import AppGrid from '@/components/ui/grid/app-grid';
import { Spin } from 'antd';
import { ReleasesData } from '../../types';
import GridCardRelease from './grid-card';

type Props = {
    data: ReleasesData[];
    loading: boolean;
    scroll?: {
        x?: number;
        y?: number;
    };
};

export default function ReleasesGridTable({ scroll, data, loading }: Props) {
    return (
        <Spin spinning={loading} delay={200}>
            <AppGrid
                className="px-4 py-4"
                style={{
                    maxHeight: scroll?.y,
                    maxWidth: scroll?.x,
                    overflowY: 'auto',
                }}
            >
                {data?.map((item) => {
                    return (
                        <>
                            <GridCardRelease key={item.id} data={item} />
                        </>
                    );
                })}
            </AppGrid>
        </Spin>
    );
}
