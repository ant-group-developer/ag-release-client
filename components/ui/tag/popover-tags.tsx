import { Popover, Tag, TagProps, Typography } from 'antd';

type Props = TagProps & {
    tags?: string[];
    maxVisibleTags?: number;
};

export default function PopoverTags({
    tags,
    maxVisibleTags = 1,
    ...props
}: Props) {
    if (!tags) {
        return null;
    }

    const visibleTags = tags.slice(0, maxVisibleTags);
    const hiddenTags = tags.slice(maxVisibleTags);

    const restTags = () => {
        return (
            <div className="flex items-center justify-center gap-1">
                {hiddenTags.map((item, index) => {
                    return (
                        <Tag key={item} className="!mr-0">
                            <Typography.Text
                                ellipsis={{ tooltip: true }}
                                style={{ maxWidth: 200 }}
                            >
                                {item}
                            </Typography.Text>
                        </Tag>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag, index) => (
                <Tag key={tag} className="!mr-0">
                    <Typography.Text
                        ellipsis={{ tooltip: true }}
                        style={{ maxWidth: 200 }}
                    >
                        {tag}
                    </Typography.Text>
                </Tag>
            ))}
            {hiddenTags.length > 0 && (
                <Popover content={restTags()}>
                    <Tag> +{hiddenTags.length} </Tag>
                </Popover>
            )}
        </div>
    );
}
