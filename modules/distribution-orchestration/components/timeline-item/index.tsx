import { Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { EVENT_LEVEL } from '../../enums';
import { isMilestoneLevel } from '../../helpers';
import { TimelineEvent } from '../../types';

interface Props {
    event: TimelineEvent;
}

/** 1 dòng event trên timeline. Milestone in đậm; progress mờ hơn. */
export default function DistributionTimelineItem({ event }: Props) {
    const milestone = isMilestoneLevel(event.level);

    return (
        <div className="flex flex-col gap-1">
            <Space size={6} wrap>
                <Typography.Text strong={milestone}>
                    {event.type}
                </Typography.Text>
                {event.channelId && (
                    <Tag bordered={false} color="blue" className="font-normal">
                        {event.channelId}
                    </Tag>
                )}
                {!milestone && (
                    <Tag bordered={false} className="font-normal">
                        {EVENT_LEVEL.PROGRESS}
                    </Tag>
                )}
            </Space>

            <Typography.Text type="secondary" className="text-xs">
                {dayjs(event.occurredAt).format('YYYY-MM-DD HH:mm:ss')}
            </Typography.Text>

            {event.payload && Object.keys(event.payload).length > 0 && (
                <Typography.Paragraph
                    type="secondary"
                    className="!mb-0 text-xs"
                    ellipsis={{ rows: 3, expandable: true }}
                >
                    <code>{JSON.stringify(event.payload)}</code>
                </Typography.Paragraph>
            )}
        </div>
    );
}
