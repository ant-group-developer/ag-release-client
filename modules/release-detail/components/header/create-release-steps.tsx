import { StepProps, Steps, StepsProps } from 'antd';
import {
    BadgeAlert,
    Check,
    Ellipsis,
    SquarePen,
    Trash2,
    X,
} from 'lucide-react';

type Props = Omit<StepProps, 'items'> & {};

export default function ReleaseDetailSteps({ ...props }: Props) {
    const items: StepsProps['items'] = [
        {
            title: <span className="text-xsfont-medium">Draft</span>,
            status: 'finish',
            icon: <SquarePen />,
        },
        {
            title: <span className="text-xs font-medium">Processing</span>,
            icon: <Ellipsis />,
        },
        {
            title: <span className="text-xs font-medium">Issues</span>,
            icon: <BadgeAlert />,
        },
        {
            title: <span className="text-xs font-medium">Distributed</span>,
            icon: <Check />,
        },
        {
            title: (
                <span className="text-xs font-medium">Never Distributed</span>
            ),
            icon: <X />,
        },
        {
            title: <span className="text-xs font-medium">Taken Down</span>,
            icon: <Trash2 />,
        },
    ];
    return (
        <div className="w-3/6 py-2">
            <Steps
                current={0}
                percent={80}
                size="small"
                labelPlacement="vertical"
                items={items}
                {...props}
            />
        </div>
    );
}
