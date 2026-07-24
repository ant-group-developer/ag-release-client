import { Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { DISTRIBUTION_STATE } from '../../enums';
import { getDistributionStateColor } from '../../helpers';

interface Props {
    state?: DISTRIBUTION_STATE | null;
}

/** Tag hiển thị DistributionState. state null = chưa submit. */
export default function DistributionStateTag({ state }: Props) {
    const messages = useTranslations();

    if (!state) {
        return (
            <Tag bordered={false} className="font-normal">
                {messages('distributionOrchestration.notSubmitted')}
            </Tag>
        );
    }

    return (
        <Tag
            bordered={false}
            color={getDistributionStateColor(state)}
            className="font-normal"
        >
            {messages(`distributionOrchestration.state.${state}`)}
        </Tag>
    );
}
