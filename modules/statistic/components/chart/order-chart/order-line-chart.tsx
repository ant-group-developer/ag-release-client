import LoadingBox from '@/components/loading-box';
import { useTranslations } from 'next-intl';
import { OrderGraphData } from '../../../types/order-statistic';
import CustomLineChart from '../custom-line-chart';

type Props = {
    orderGraphData: OrderGraphData[];
    loading: boolean;
};

export default function OrderLineChart({ orderGraphData, loading }: Props) {
    const messages = useTranslations();

    if (loading) {
        return <LoadingBox className="flex h-[400px] items-center" />;
    }

    return (
        <CustomLineChart text={messages('order.title')} data={orderGraphData} />
    );
}
