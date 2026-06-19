import { Typography } from 'antd';
import { OVERVIEW_FALLBACK_VALUE } from './overview-constants';

const { Text } = Typography;

type Props = {
    value?: string | number | null;
    strong?: boolean;
};

export default function OverviewText({ value, strong = false }: Props) {
    return (
        <Text strong={strong} className="text-[14px]">
            {value || OVERVIEW_FALLBACK_VALUE}
        </Text>
    );
}
