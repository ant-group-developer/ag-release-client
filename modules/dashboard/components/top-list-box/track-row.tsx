import { SIZE_ICON } from '@/constants/common';
import { Music } from 'lucide-react';
import Image from 'next/image';
import { TopListRowData } from '../../types';

type Props = {
    data: TopListRowData;
};

export default function TopListRow({ data }: Props) {
    return (
        <div className="flex cursor-pointer items-center justify-between rounded-lg px-5 py-2 hover:bg-gray-100">
            <div className="flex items-center">
                <div className="w-6 text-gray-500"> {data?.id} </div>
                <div className="h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-card-bg">
                    {data?.image ? (
                        <Image
                            src={data.image}
                            alt={''}
                            width={48}
                            height={48}
                        />
                    ) : (
                        <div className="flex h-12 items-center justify-center">
                            <Music size={SIZE_ICON} />
                        </div>
                    )}
                </div>
                <div className="ml-2">
                    <p className="font-semibold hover:underline">
                        {data?.title}
                    </p>
                    {data?.artist && (
                        <p className="text-gray-500 hover:underline">
                            {data?.artist}
                        </p>
                    )}
                </div>
            </div>
            <div>
                <span>15.132 </span>
                <span className="text-gray-500">(15,8%)</span>
            </div>
        </div>
    );
}
