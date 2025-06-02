import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Button } from 'antd';
import { Check, Pen, SquareArrowOutUpRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import LinkProfileArtist from '../modal/link-profile-artist';

type Props = {
    list: {
        icon: string;
        name?: string;
        id: string;
    }[];
    linkedPlatforms?: {
        id: string;
        name: string;
    }[];
    className?: string;
};

export default function ArtistProfilesList({
    list,
    linkedPlatforms = [],
    className,
}: Props) {
    const [selectedPlatform, setSelectedPlatform] = useState<any>(null);
    const openModal = useModalStore((state) => state.openModal);
    if (list.length === 0) return null;

    const isLinked = (platformId: string) => {
        return linkedPlatforms.some((platform) => platform.id === platformId);
    };

    return (
        <div
            className={cn(
                'custom-scrollbar flex max-h-[245px] flex-col gap-2 overflow-y-auto rounded-md',
                className
            )}
        >
            {list.map((item, index) => {
                const linked = isLinked(item.id);
                return (
                    <>
                        <div
                            key={index}
                            className={cn(
                                'flex cursor-pointer items-center justify-between rounded-md p-3 hover:bg-gray-200',
                                linked
                                    ? 'bg-green-500 text-white hover:bg-green-500'
                                    : 'bg-gray-100'
                            )}
                        >
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
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => setSelectedPlatform(item)}
                                    type="text"
                                    shape="round"
                                    className={cn(
                                        'group !bg-zinc-300/50 font-medium hover:!bg-zinc-300',
                                        {
                                            '!bg-white/10 !text-white hover:!bg-white/20':
                                                linked,
                                        }
                                    )}
                                >
                                    <span>
                                        {linked ? (
                                            <div>
                                                <p className="flex items-center gap-2 group-hover:hidden">
                                                    <Check size={SIZE_ICON} />
                                                    <span>Đã liên kết</span>
                                                </p>
                                                <p className="hidden items-center gap-2 group-hover:flex">
                                                    <Pen size={SIZE_ICON} />
                                                    <span>Sửa hồ sơ</span>
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="flex items-center gap-2">
                                                Liên kết hồ sơ
                                            </p>
                                        )}
                                    </span>
                                </Button>
                                <Button
                                    type="text"
                                    shape="circle"
                                    className={cn(
                                        'group !bg-zinc-300/50 font-medium hover:!bg-zinc-300',
                                        {
                                            '!bg-white/10 !text-white hover:!bg-white/20':
                                                linked,
                                        }
                                    )}
                                >
                                    <SquareArrowOutUpRight size={SIZE_ICON} />
                                </Button>
                            </div>
                        </div>
                        <LinkProfileArtist
                            open={!!selectedPlatform}
                            onClose={() => setSelectedPlatform(null)}
                            platformData={selectedPlatform}
                        />
                    </>
                );
            })}
        </div>
    );
}
