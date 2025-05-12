import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import {
    cn,
    formattedDate,
    getColorByStatus,
    getIntlCodeByStatus,
} from '@/helpers/common';
import { ProductUploadHistoryData } from '@/modules/product/types';
import { Tag, Timeline } from 'antd';
import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ReactNode } from 'react';

type Props = {
    data: ProductUploadHistoryData[];
    className?: string;
    icon: ReactNode;
    title: ReactNode;
};

export default function HistoryTimeline({
    data,
    className,
    icon,
    title,
}: Props) {
    const messages = useTranslations();

    // const getStatusName = (value: ORDER_STATUS) => {
    //     switch (value) {
    //         case ORDER_STATUS.COMPLETED:
    //             return messages('order.status.completed');

    //         case ORDER_STATUS.IN_PROGRESS:
    //             return messages('order.status.inProgress');

    //         case ORDER_STATUS.NEW:
    //             return messages('order.status.new');

    //         case ORDER_STATUS.OVERDUE:
    //             return messages('order.status.deadline');

    //         case ORDER_STATUS.PENDING_APPROVAL:
    //             return messages('order.status.pendingApproval');

    //         case ORDER_STATUS.REJECT:
    //             return messages('order.status.reject');

    //         default:
    //             break;
    //     }
    // };

    const handleNewTabFile = (id: string) => {
        if (!id) return;
        window.open(
            'https://drive.google.com/file/d/' + id + '/view',
            '_blank'
        );
    };

    if (data.length === 0) {
        return null;
    }
    return (
        <div className={cn(className)}>
            <p className="text-text-base mb-4 flex items-center gap-2 font-bold">
                {icon}
                <span>{title}</span>
            </p>
            <Timeline
                items={data.map((item) => ({
                    color: getColorByStatus(item.status),
                    children: (
                        <CustomTooltip
                            title={`${item?.googleDriveFileId ? messages('product.clickToViewThisFile') : ''}`}
                        >
                            <div
                                className="group relative cursor-pointer rounded-md p-1 hover:bg-slate-100"
                                onClick={() =>
                                    handleNewTabFile(
                                        item?.googleDriveFileId as string
                                    )
                                }
                            >
                                <div className="flex items-center gap-2">
                                    <span>
                                        {formattedDate(item.dateCreated)}
                                    </span>
                                    <Tag color={getColorByStatus(item.status)}>
                                        {messages(
                                            getIntlCodeByStatus(item.status)
                                        )}
                                    </Tag>
                                </div>
                                <p className="text-gray-500">
                                    {item?.creatorUser?.name}
                                </p>
                                {item?.googleDriveFileId && (
                                    <div className="absolute right-8 top-1 group-hover:text-blue-500">
                                        <ExternalLink size={SIZE_ICON} />
                                    </div>
                                )}
                            </div>
                        </CustomTooltip>
                    ),
                }))}
            />
        </div>
    );
}
