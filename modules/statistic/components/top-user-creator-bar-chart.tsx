import LoadingBox from '@/components/loading-box';
import { useTranslations } from 'next-intl';
import { TopUserData, TopUserFilter } from '../types/user-statistic';
import CustomBarChart from './chart/custom-bar-chart';

type Props = {
    data: TopUserData[];
    dataFilter: TopUserFilter;
    loading: boolean;
};

export default function TopUserCreatorOrder({
    data,
    dataFilter,
    loading,
}: Props) {
    const messages = useTranslations();
    // const locale = useLocale();
    // const { canRead } = usePermissionStore((state) => state.permission.order);

    // const handleBarClick = (payload: TopUserData) => {
    //     const userId = payload?.userCreatorId;
    //     if (!userId || !canRead) return;

    //     const url = `/${locale}${APP_ROUTES.ORDER}?creatorId=${userId}&startDateDeadline=${dataFilter.startDate}&endDateDeadline=${dataFilter.endDate}${
    //         dataFilter.typeOrder ? `&type=${dataFilter.typeOrder}` : ''
    //     }`;
    //     window.open(url, '_blank');
    // };

    if (loading) {
        return <LoadingBox className="flex h-[250px] items-center" />;
    }

    return (
        <>
            <p className="px-8 pb-4 text-left text-base font-bold">
                {messages('user.topUserCreatedOrder')}
            </p>
            <CustomBarChart
                data={data}
                tooltipText={messages('order.title')}
                // onBarClick={handleBarClick}
            />
        </>
    );
}
