import { Image, ImageProps } from 'antd';
import { getLinkIllustrative } from '../helpers/get-link-illustrative';
import { IllustrativeImageInfor } from '../types';

type Props = ImageProps & {
    title?: string;
    data?: IllustrativeImageInfor[];
};

export default function IllustrativeImageList({ data, ...props }: Props) {
    return (
        <>
            <Image.PreviewGroup {...props}>
                <div className="flex gap-2">
                    {data?.map(({ fileInfor, file }, index) => (
                        <Image
                            className="h-full max-h-40 w-full rounded-md"
                            preview={{
                                maskClassName: 'rounded-md',
                            }}
                            key={index}
                            alt=""
                            src={getLinkIllustrative(
                                file?.googleDriveFileId,
                                fileInfor?.readUrl
                            )}
                        />
                    ))}
                </div>
            </Image.PreviewGroup>
        </>
    );
}
