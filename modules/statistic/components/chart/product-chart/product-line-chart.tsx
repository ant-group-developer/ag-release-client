import LoadingBox from '@/components/loading-box';
import { useTranslations } from 'next-intl';
import { ProductGraphData } from '../../../types/product-statistic';
import CustomLineChart from '../custom-line-chart';

type Props = {
    className?: string;
    productGraphData: ProductGraphData[];
    loading: boolean;
};

export default function ProductLineChart({
    productGraphData,
    className,
    loading,
}: Props) {
    const messages = useTranslations();

    if (loading) {
        return <LoadingBox className="flex h-[400px] items-center" />;
    }

    return (
        <CustomLineChart
            text={messages('product.label')}
            data={productGraphData}
            className={className}
        />
    );
}
