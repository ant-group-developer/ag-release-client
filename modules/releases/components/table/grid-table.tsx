import AppGrid from '@/components/ui/grid/app-grid';
import CardRelease from '@/modules/dashboard/components/card/card-release';
import { Spin } from 'antd';
import { ReleasesData } from '../../types';

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
                            <CardRelease key={item.id} data={item} />
                            {/* <GridCardRelease key={item.id} data={item} /> */}
                        </>
                    );
                })}
            </AppGrid>
        </Spin>
    );
}
