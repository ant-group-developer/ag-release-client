import { CircleHelp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = {};

export default function ListStatistic({}: Props) {
    const messages = useTranslations();
    return (
        <div>
            {/* <p className="text-lg font-bold">{messages('common.statistic')}</p> */}

            <div className="grid grid-cols-4 gap-4">
                <div className="flex justify-between gap-6 rounded-lg border !border-gray-200 p-4 dark:!border-zinc-800">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#ffece7]">
                        <Image
                            width={48}
                            height={48}
                            src="/icon/deal.png"
                            alt=""
                        />
                        {/* <BriefcaseBusiness
                            className="text-[#f56015]"
                            size={28}
                        /> */}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                        <p className="text-lg font-bold">Đối tác</p>
                        <p className="text-lg font-medium">32</p>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-2 text-2xl font-bold">
                        <div className="flex w-full justify-end">
                            <CircleHelp />
                        </div>
                        <span className="text-green-600">+24%</span>
                    </div>
                </div>
                <div className="flex justify-between gap-6 rounded-lg border !border-gray-200 p-4 dark:!border-zinc-800">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#ffece7]">
                        <Image
                            width={48}
                            height={48}
                            src="/icon/deal.png"
                            alt=""
                        />
                        {/* <BriefcaseBusiness
                            className="text-[#f56015]"
                            size={28}
                        /> */}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                        <p className="text-lg font-bold">Doanh thu</p>
                        <p className="text-base font-medium">100.000.000VNĐ</p>
                    </div>
                    <div className="flex flex-col items-center justify-between text-2xl font-bold">
                        <div className="flex w-full justify-end">
                            <CircleHelp />
                        </div>
                        <span className="text-green-600">+24%</span>
                    </div>
                </div>
                <div className="flex justify-between gap-6 rounded-lg border !border-gray-200 p-4 dark:!border-zinc-800">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#ffece7]">
                        <Image
                            width={48}
                            height={48}
                            src="/icon/deal.png"
                            alt=""
                        />
                        {/* <BriefcaseBusiness
                            className="text-[#f56015]"
                            size={28}
                        /> */}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                        <p className="text-lg font-bold">Vấn đề</p>
                        <p className="text-base font-medium">12</p>
                    </div>
                    <div className="flex flex-col items-center justify-between text-2xl font-bold">
                        <div className="flex w-full justify-end">
                            <CircleHelp />
                        </div>
                        <span className="text-red-600">+24%</span>
                    </div>
                </div>
                <div className="flex justify-between gap-6 rounded-lg border !border-gray-200 p-4 dark:!border-zinc-800">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#ffece7]">
                        <Image
                            width={48}
                            height={48}
                            src="/icon/deal.png"
                            alt=""
                        />
                        {/* <BriefcaseBusiness
                            className="text-[#f56015]"
                            size={28}
                        /> */}
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                        <p className="text-lg font-bold">Hoạt động</p>
                        <p className="text-base font-medium">10</p>
                    </div>
                    <div className="flex flex-col items-center justify-between text-2xl font-bold">
                        <div className="flex w-full justify-end">
                            <CircleHelp />
                        </div>
                        <span className="text-red-600">+24%</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
