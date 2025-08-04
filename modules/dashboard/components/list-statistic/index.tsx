import {
    BadgeAlert,
    BriefcaseBusiness,
    CircleDollarSign,
    CircleHelp,
    Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {};

export default function ListStatistic({}: Props) {
    const messages = useTranslations();
    return (
        <div>
            {/* <p className="text-lg font-bold">{messages('common.statistic')}</p> */}

            <div className="grid grid-cols-4 gap-4">
                <div className="flex justify-between gap-6 rounded-lg border !border-gray-200 p-4 dark:!border-zinc-800">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full">
                        {/* <Image
                            width={48}
                            height={48}
                            src="/icon/deal.png"
                            alt=""
                            className="rounded-full"
                        /> */}
                        <BriefcaseBusiness
                            // className="text-[#f56015]"
                            size={28}
                        />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                        <p className="text-lg font-bold">
                            {messages('common.partners')}
                        </p>
                        <p className="text-lg font-medium">32</p>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-2 text-xl font-bold">
                        <div className="flex w-full justify-end">
                            <CircleHelp />
                        </div>
                        <span className="text-green-600">+24%</span>
                    </div>
                </div>

                <div className="flex justify-between gap-6 rounded-lg border !border-gray-200 p-4 dark:!border-zinc-800">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full">
                        {/* <Image
                            width={48}
                            height={48}
                            src="/icon/deal.png"
                            alt=""
                            className="rounded-full"
                        /> */}
                        <CircleDollarSign
                            // className="text-[#f56015]"
                            size={28}
                        />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                        <p className="text-lg font-bold">
                            {messages('common.revenue')}
                        </p>
                        <p className="text-lg font-medium">20.231.253$</p>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-2 text-xl font-bold">
                        <div className="flex w-full justify-end">
                            <CircleHelp />
                        </div>
                        <span className="text-green-600">+24%</span>
                    </div>
                </div>

                <div className="flex justify-between gap-6 rounded-lg border !border-gray-200 p-4 dark:!border-zinc-800">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full">
                        {/* <Image
                            width={48}
                            height={48}
                            src="/icon/deal.png"
                            alt=""
                            className="rounded-full"
                        /> */}
                        <BadgeAlert
                            // className="text-[#f56015]"
                            size={28}
                        />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                        <p className="text-lg font-bold">
                            {messages('common.issues')}
                        </p>
                        <p className="text-lg font-medium">10</p>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-2 text-xl font-bold">
                        <div className="flex w-full justify-end">
                            <CircleHelp />
                        </div>
                        <span className="text-red-600">+24%</span>
                    </div>
                </div>

                <div className="flex justify-between gap-6 rounded-lg border !border-gray-200 p-4 dark:!border-zinc-800">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full">
                        {/* <Image
                            width={48}
                            height={48}
                            src="/icon/deal.png"
                            alt=""
                            className="rounded-full"
                        /> */}
                        <Users
                            // className="text-[#f56015]"
                            size={28}
                        />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                        <p className="text-lg font-bold">
                            {messages('common.activities')}
                        </p>
                        <p className="text-lg font-medium">15</p>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-2 text-xl font-bold">
                        <div className="flex w-full justify-end">
                            <CircleHelp />
                        </div>
                        <span className="text-green-600">+20%</span>
                    </div>
                </div>

                {/* <div className="flex justify-between gap-6 rounded-lg border !border-gray-200 p-4 dark:!border-zinc-800">
                    <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#ffece7]">
                        <Image
                            width={48}
                            height={48}
                            src="/icon/wallet.png"
                            alt=""
                            className="rounded-full"
                        />
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
                            src="/icon/warning.png"
                            alt=""
                        />
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
                            src="/icon/group.png"
                            alt=""
                        />
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
                </div> */}
            </div>
        </div>
    );
}
