import { Popover, Tag } from 'antd';

type Props = {
    tags?: string[];
};

export default function PopoverTags({ tags, ...props }: Props) {
    if (!tags) {
        return null;
    }

    const restTags = () => {
        return (
            <div className="flex items-center justify-center gap-1">
                {tags.map((item, index) => {
                    if (index === 0) return null;
                    return (
                        <Tag key={index} className="!mr-0">
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
            <Tag className="!mr-1"> {tags[0]} </Tag>
            {tags.length > 1 && (
                <Popover content={restTags()}>
                    <Tag> +{tags.length - 1} </Tag>
                </Popover>
            )}
        </div>
    );
}
