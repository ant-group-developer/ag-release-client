import { cn } from '@/helpers/common';
import { ORDER_STATUS } from '@/modules/order/enums';
import { Card, Tooltip } from 'antd';
import { ReactNode } from 'react';

export interface CardStatusOption {
    title: string;
    value: number;
    status?: ORDER_STATUS;
    isTotal?: boolean;
    tooltip?: string;
}

type Props = {
    title: ReactNode;
    className?: string;
    options: CardStatusOption[];
    onClick?: (status: ORDER_STATUS) => void;
};

export default function CardStatus({
    className,
    options,
    onClick,
    ...props
}: Props) {
    return (
        <Card {...props}>
            <div className="grid grid-cols-4 lg:grid-cols-8">
                {options.map((item, index) => {
                    // Tổng không render tooltip
                    if (index === 0)
                        return (
                            <div
                                key={index}
                                onClick={() =>
                                    !item.isTotal &&
                                    item.status &&
                                    onClick?.(item.status)
                                }
                                className={cn(
                                    'rounded-lg py-1 text-center',
                                    !item.isTotal &&
                                        'cursor-pointer hover:bg-gray-200/80'
                                )}
                            >
                                <p className="text-2xl font-bold">
                                    {item.value}
                                </p>
                                <p>{item.title}</p>
                            </div>
                        );
                    // Các status còn lại
                    return (
                        <Tooltip key={index} title={item?.tooltip}>
                            <div
                                onClick={() =>
                                    !item.isTotal &&
                                    item.status &&
                                    onClick?.(item.status)
                                }
                                className={cn(
                                    'rounded-lg py-1 text-center',
                                    !item.isTotal &&
                                        'cursor-pointer hover:bg-gray-200/80'
                                )}
                            >
                                <p className="text-2xl font-bold">
                                    {item.value}
                                </p>
                                <p>{item.title}</p>
                            </div>
                        </Tooltip>
                    );
                })}
            </div>
        </Card>
    );
}
