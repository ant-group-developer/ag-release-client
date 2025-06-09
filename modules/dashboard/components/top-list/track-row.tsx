import ImageFallback from '@/components/ui/image/image-fallback';
import { FALLBACK_IMAGE } from '@/constants/common';
import { cn } from '@/helpers/common';
import { TopListRowData } from '../../types';

type Props = {
    data: TopListRowData;
    typeShapeImage?: 'circle' | 'square';
    index: number;
};

export default function TopListRow({
    data,
    typeShapeImage = 'square',
    index,
}: Props) {
    return (
        <div className="flex cursor-pointer items-center justify-between px-5 py-2 hover:bg-gray-100 dark:hover:bg-card-bg-dark">
            <div className="flex items-center">
                <div className="w-6 text-gray-500"> {index + 1} </div>
                <div
                    className={cn(
                        'h-12 w-12 cursor-pointer items-center justify-center overflow-hidden bg-card-bg',
                        {
                            'rounded-full': typeShapeImage === 'circle',
                        }
                    )}
                >
                    {/* {data?.image ? ( */}
                    <ImageFallback
                        fallbackSrc={FALLBACK_IMAGE}
                        src={data?.image as string}
                        alt={''}
                        width={48}
                        height={48}
                        className="h-12 w-12 object-cover"
                    />
                    {/* ) : (
                        <div className="flex h-12 items-center justify-center">
                            <Music size={SIZE_ICON} />
                        </div>
                    )} */}
                </div>
                <div className="ml-2">
                    <p className="font-semibold hover:underline">
                        {data?.title}
                    </p>
                    <p className="text-gray-500 hover:underline">
                        {data?.artist}
                    </p>
                </div>
            </div>
            <div>
                <span> {data?.plays} </span>
                {/* <span className="text-gray-500">(15,8%)</span> */}
            </div>
        </div>
    );
}
