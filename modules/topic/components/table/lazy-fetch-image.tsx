import { useIntersectionObserver } from '@uidotdev/usehooks';
// import { ImageProps } from 'antd';
import { FALLBACK_IMAGE } from '@/constants/common';
import { Image } from 'antd';
import { useGetImageTopic } from '../../hooks/use-get-image-topic';
import { TopicData } from '../../types';

interface Props {
    data: TopicData;
    className?: string;
}

const LazyFetchImage = ({ data, ...props }: Props) => {
    const [ref, entry] = useIntersectionObserver({
        threshold: 0,
        root: null,
        rootMargin: '0px',
    });

    const { imageIllustrative, imageIllustrativeId } = data;

    // const { fileData } = useGetImage(
    //     imageIllustrativeId,
    //     !!entry?.isIntersecting && !imageIllustrative?.googleDriveFileId
    // );

    // const imgUrl = imageIllustrative?.googleDriveFileId
    //     ? getLinkDrive(imageIllustrative?.googleDriveFileId)
    //     : fileData?.readUrl;

    const imgUrl = useGetImageTopic(
        imageIllustrativeId,
        !!entry?.isIntersecting && !imageIllustrative?.googleDriveFileId,
        imageIllustrative?.googleDriveFileId
    );

    return (
        <div ref={ref}>
            {/* <ImageFallback
                {...props}
                src={imgUrl}
                alt={data.code}
                width={80}
                height={45}
            /> */}
            <Image
                {...props}
                src={imgUrl}
                alt={data.code}
                fallback={FALLBACK_IMAGE}
                preview={false}
            />
        </div>
    );
};

export default LazyFetchImage;
