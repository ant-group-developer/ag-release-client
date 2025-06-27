'use client';

import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import EmailSenderForm from '@/modules/email-sender/components/form';
import { Avatar, Select, SelectProps } from 'antd';
import { UserRoundX } from 'lucide-react';

type Props = {};

export default function EmailSender({}: Props) {
    const option: SelectProps['options'] = [
        {
            label: 'Nguyễn A',
            value: 'A',
        },
        {
            label: 'Nguyễn B',
            value: 'B',
        },
        {
            label: 'Nguyễn C',
            value: 'C',
        },
    ];

    return (
        <div className="h-full">
            <div className="flex h-full overflow-hidden pr-[350px]">
                <div className="min-w-0 flex-1 overflow-y-auto">
                    <EmailSenderForm />
                </div>
                <div className="fixed right-0 top-16 h-full w-[350px] overflow-y-auto border-l bg-white py-4">
                    <div className="px-4">
                        <Select
                            showSearch
                            options={option}
                            className="w-full"
                            placeholder={'Chọn người nhận'}
                            allowClear
                        />
                    </div>
                    <div className="my-2">
                        <div className="cursor-pointer px-4 py-2 hover:bg-card-bg-hover">
                            <div className="flex items-center justify-between gap-1">
                                <div className="space-x-1">
                                    <Avatar shape="square"> A </Avatar>
                                    <span className="font-bold">Nguyễn A</span>
                                    <span className="text-gray-500">
                                        nguyena@gmail.com
                                    </span>
                                </div>
                                <div>
                                    <IconButton>
                                        <UserRoundX
                                            className="text-red-500"
                                            size={SIZE_ICON}
                                        />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                        <div className="cursor-pointer px-4 py-2 hover:bg-card-bg-hover">
                            <div className="flex items-center justify-between gap-1">
                                <div className="space-x-1">
                                    <Avatar shape="square"> B </Avatar>
                                    <span className="font-bold">Nguyễn B</span>
                                    <span className="text-gray-500">
                                        nguyena@gmail.com
                                    </span>
                                </div>
                                <div>
                                    <IconButton>
                                        <UserRoundX
                                            className="text-red-500"
                                            size={SIZE_ICON}
                                        />
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
