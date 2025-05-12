import { cn } from '@/helpers/common';

type GoogleDriveEmbedProps = JSX.IntrinsicElements['iframe'] & {
    showFullscreenButton?: boolean;
};

export default function GoogleDriveEmbed({
    className,
    ...props
}: GoogleDriveEmbedProps) {
    return (
        <iframe
            width="100%"
            height="100%"
            allow="autoplay; fullscreen"
            {...props}
            className={cn('rounded-lg', className)}
        />
    );
}
