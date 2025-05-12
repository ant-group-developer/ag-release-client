import { useTranslations } from 'next-intl';
import CustomMixBarChart from '../mix-bar-chart';

type Props = {
    // orderGraphData: OrderGraphData[];
    // loading: boolean;
};

export default function OrderMixBarChart({}: Props) {
    const messages = useTranslations();

    // if (loading) {
    //     return <LoadingBox className="flex h-[400px] items-center" />;
    // }

    return (
        <CustomMixBarChart
        // text={messages('order.title')}
        // data={orderGraphData}
        />
    );
}
