import { getLinkDriveImage } from '@/helpers/link';
import Image, { ImageProps } from 'next/image';

type Props = Omit<ImageProps, 'src' | 'alt'> & {
    googleDriveFileId: string;
};

export default function DriveIconImage({ googleDriveFileId, ...props }: Props) {
    if (!googleDriveFileId) return null;

    const url = getLinkDriveImage(googleDriveFileId);

    return (
        <div className="flex justify-center">
            <Image src={url} alt="icon" width={50} height={50} {...props} />
        </div>
    );
}
