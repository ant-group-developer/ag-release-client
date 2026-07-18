import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';
import { DspData } from '@/modules/dsp/types';
import { Popover, Tag, TagProps, Typography } from 'antd';

type Props = TagProps & {
    tags?: string[];
    maxVisibleTags?: number;
    dspList?: DspData[];
};

export default function PopoverDspTags({
    tags,
    maxVisibleTags = 1,
    dspList,
    ...props
}: Props) {
    if (!tags) {
        return null;
    }

    const visibleTags = tags.slice(0, maxVisibleTags);
    const hiddenTags = tags.slice(maxVisibleTags);

    const getDspPicture = (ciCode: string) => {
        const dsp = dspList?.find((d) => d.codeCi === ciCode);
        return dsp?.picture ?? FALLBACK_IMAGE;
    };

    const getDspName = (ciCode: string) => {
        const dsp = dspList?.find((d) => d.codeCi === ciCode);
        return dsp?.name ?? ciCode;
    };

    const renderTag = (item: string) => {
        const picture = getDspPicture(item);
        const name = getDspName(item);

        return (
            <Tag key={item} className="!mr-0" {...props}>
                <span className="flex items-center gap-1.5">
                    <ImageFallback
                        fallbackSrc={FALLBACK_IMAGE}
                        src={picture}
                        alt={name}
                        width={16}
                        height={16}
                        className="aspect-square rounded-full object-cover"
                    />
                    <Typography.Text
                        ellipsis={{ tooltip: true }}
                        style={{ maxWidth: 100, marginBottom: 0 }}
                    >
                        {name}
                    </Typography.Text>
                </span>
            </Tag>
        );
    };

    const restTags = () => {
        return (
            <div className="flex max-w-[30vw] flex-wrap items-start gap-1">
                {hiddenTags.map((item) => renderTag(item))}
            </div>
        );
    };

    return (
        <div className="flex flex-wrap gap-1">
            {visibleTags.map((tag) => renderTag(tag))}
            {hiddenTags.length > 0 && (
                <Popover content={restTags()}>
                    <Tag className="!mr-0"> +{hiddenTags.length} </Tag>
                </Popover>
            )}
        </div>
    );
}
