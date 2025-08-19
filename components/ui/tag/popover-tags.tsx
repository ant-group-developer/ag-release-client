import { Popover, Tag } from 'antd';

type Props = {
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
                            {' '}
                            {item}{' '}
                        </Tag>
                    );
                })}
            </div>
        );
    };

    return (
        <div>
            {visibleTags.map((tag, index) => (
                <Tag key={tag} className="!mr-1">
                    {tag}
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
