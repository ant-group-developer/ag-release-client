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
            label: 'Marketing Team',
            value: 'marketing',
        },
        {
            label: 'Tech Department',
            value: 'tech',
        },
        {
            label: 'Operations Team',
            value: 'operation',
        },
    ];

    return (
        <div className="h-full">
            <div className="flex h-full overflow-hidden pr-[350px]">
                <div className="min-w-0 flex-1 overflow-y-auto px-8 py-4">
                    <EmailSenderForm />
                </div>
                <div className="fixed right-0 top-16 h-full w-[350px] overflow-y-auto border-l py-4">
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
                                <div className="flex w-full items-center gap-2">
                                    <div>
                                        <Avatar
                                            shape="square"
                                            src={
                                                'https://storage.googleapis.com/ant-music-assets/tenants/20250827160028_channels4_profile.jpg'
                                            }
                                        >
                                            A
                                        </Avatar>
                                    </div>
                                    <div className="max-w-56">
                                        <p className="truncate font-bold">
                                            Beta Music
                                        </p>
                                        <p className="truncate text-gray-500">
                                            beta@ant-group.net
                                        </p>
                                    </div>
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
                                <div className="flex w-full items-center gap-2">
                                    <div>
                                        <Avatar
                                            shape="square"
                                            src={
                                                'https://storage.googleapis.com/ant-music-assets/tenants/20251014111519_winstar.jpg'
                                            }
                                        >
                                            {' '}
                                            A{' '}
                                        </Avatar>
                                    </div>
                                    <div className="max-w-56">
                                        <p className="truncate font-bold">
                                            Winstar Media
                                        </p>
                                        <p className="truncate text-gray-500">
                                            admin@rise-media.us
                                        </p>
                                    </div>
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
