import { OPACITY_TAG } from '@/constants/common';
import { hexToRGBA } from '@/helpers/common';
import { Tag, TagProps } from 'antd';

type Props = TagProps & {
    color: string;
    name: string;
};

export default function ProductTypeTag({ color, name, ...props }: Props) {
    if (!color || !name) {
        return null;
    }

    const rgbaColor = hexToRGBA(color, OPACITY_TAG);

    return (
        <Tag color={rgbaColor} bordered={false} {...props}>
            <span
                className="cursor-pointer group-hover:underline"
                style={{
                    color: color,
                }}
            >
                {name}
            </span>
        </Tag>
    );
}
