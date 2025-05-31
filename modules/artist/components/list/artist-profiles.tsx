import { cn } from '@/helpers/common';
import { Button } from 'antd';
import Image from 'next/image';

type Props = {
    list: {
        icon: string;
        name?: string;
    }[];
    className?: string;
};

export default function ArtistProfilesList({ list, className }: Props) {
    if (list.length === 0) return null;
    return (
        <div
            className={cn(
                'custom-scrollbar flex max-h-[180px] flex-col gap-2 overflow-y-auto rounded-md',
                className
            )}
        >
            {list.map((item) => (
                <div className="flex cursor-pointer items-center justify-between rounded-md bg-card-bg p-3 hover:bg-card-bg-hover">
                    <div className="flex items-center gap-2">
                        <Image
                            className="rounded-full"
                            src={item.icon}
                            alt={item.name || ''}
                            width={32}
                            height={32}
                        />
                        <span className="font-bold">{item.name}</span>
                    </div>
                    <Button shape="round" className="font-medium">
                        Link Profile
                    </Button>
                </div>
            ))}
        </div>
    );
}
