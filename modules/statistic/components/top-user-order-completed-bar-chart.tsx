import LoadingBox from '@/components/loading-box';
import usePermissionStore from '@/hooks/use-permission';
import { useLocale, useTranslations } from 'next-intl';
import { TopUserData, TopUserFilter } from '../types/user-statistic';
import CustomBarChart from './chart/custom-bar-chart';

type Props = {
    data: TopUserData[];
    secondTooltipText?: string;
    dataFilter: TopUserFilter;
    loading: boolean;
};

export default function TopUserCompletedProduct({
    data,
    secondTooltipText,
    dataFilter,
    loading,
}: Props) {
    const messages = useTranslations();
    const locale = useLocale();
    const { canRead } = usePermissionStore((state) => state.permission.product);

    // const handleBarClick = (payload: TopUserData) => {
    //     const userId = payload?.userCreatorId;
    //     if (!userId || !canRead) return;

    //     const url = `/${locale}${APP_ROUTES.PRODUCT}?assigneeId=${userId}&status=${ORDER_STATUS.COMPLETED}&startDateDeadline=${dataFilter.startDate}&endDateDeadline=${dataFilter.endDate}${
    //         dataFilter.typeOrderProduct
    //             ? `&type=${dataFilter.typeOrderProduct}`
    //             : ''
    //     }`;
    //     window.open(url, '_blank');
    // };

    if (loading) {
        return <LoadingBox className="flex h-[250px] items-center" />;
    }

    return (
        <>
            <p className="px-8 pb-4 text-left text-base font-bold">
                {messages('user.topUserCompletedProduct')}
            </p>
            <CustomBarChart
                data={data}
                tooltipText={messages('order.title')}
                // onBarClick={handleBarClick}
            />
        </>
    );
}
