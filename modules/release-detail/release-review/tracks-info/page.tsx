import { SIZE_ICON } from '@/constants/common';
import { Collapse, CollapseProps } from 'antd';
import { CircleAlert } from 'lucide-react';

type Props = {};

export default function TracksInfo({}: Props) {
    const items: CollapseProps['items'] = [
        {
            key: '1',
            label: <span className="text-base font-medium">1 Track one</span>,
            children: (
                <div>
                    <div className="grid grid-cols-6 bg-card-bg p-4">
                        <span className="col-span-2 font-medium">
                            Bản nhạc & nghệ sĩ
                        </span>
                        <div className="col-span-4 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Tên bài hát *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p>ISRC</p>
                                    <p className="text-gray-500">Tuỳ chọn</p>
                                </div>
                            </div>
                            <div className="col-span-4 flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-red-500">
                                            Nghệ sĩ chính *
                                        </p>
                                        <p className="text-gray-500">
                                            Bắt buộc
                                        </p>
                                    </div>
                                    <CircleAlert
                                        className="text-red-500"
                                        size={SIZE_ICON}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <p>Nghệ sĩ phụ</p>
                                        <p className="text-gray-500">
                                            Tuỳ chọn
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-4 flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-red-500">
                                            Nguồn gốc *
                                        </p>
                                        <p className="text-gray-500">
                                            Bắt buộc
                                        </p>
                                    </div>
                                    <CircleAlert
                                        className="text-red-500"
                                        size={SIZE_ICON}
                                    />
                                </div>
                            </div>
                            <div className="col-span-4 flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-red-500">
                                            Ngôn ngữ bài hát *
                                        </p>
                                        <p className="text-gray-500">
                                            Bắt buộc
                                        </p>
                                    </div>
                                    <CircleAlert
                                        className="text-red-500"
                                        size={SIZE_ICON}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 bg-card-bg p-4">
                        <span className="col-span-2 font-medium">
                            Các metadata khác
                        </span>
                        <div className="col-span-4 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Thể loại chính *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p>Thể loại phụ</p>
                                    <p className="text-gray-500">Tuỳ chọn</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Nội dung nhạy cảm *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Ngôn ngữ bài hát *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Ngôn ngữ quốc gia *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Ngôn ngữ metadata *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 bg-card-bg p-4">
                        <span className="col-span-2 font-medium">Xuất bản</span>
                        <div className="col-span-4 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">Xuất bản *</p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">Vai trò *</p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Tên nhạc sĩ *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p>Tỷ lệ cổ phần</p>
                                    <p className="text-gray-500">Tuỳ chọn</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    const items2: CollapseProps['items'] = [
        {
            key: '2',
            label: <span className="text-base font-medium">2 Track two</span>,
            children: (
                <div>
                    <div className="grid grid-cols-6 bg-card-bg p-4">
                        <span className="col-span-2 font-medium">
                            Bản nhạc & nghệ sĩ
                        </span>
                        <div className="col-span-4 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Tên bài hát *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p>ISRC</p>
                                    <p className="text-gray-500">Tuỳ chọn</p>
                                </div>
                            </div>
                            <div className="col-span-4 flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-red-500">
                                            Nghệ sĩ chính *
                                        </p>
                                        <p className="text-gray-500">
                                            Bắt buộc
                                        </p>
                                    </div>
                                    <CircleAlert
                                        className="text-red-500"
                                        size={SIZE_ICON}
                                    />
                                </div>
                                <div className="flex justify-between">
                                    <div>
                                        <p>Nghệ sĩ phụ</p>
                                        <p className="text-gray-500">
                                            Tuỳ chọn
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-4 flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-red-500">
                                            Nguồn gốc *
                                        </p>
                                        <p className="text-gray-500">
                                            Bắt buộc
                                        </p>
                                    </div>
                                    <CircleAlert
                                        className="text-red-500"
                                        size={SIZE_ICON}
                                    />
                                </div>
                            </div>
                            <div className="col-span-4 flex flex-col gap-2">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-red-500">
                                            Ngôn ngữ bài hát *
                                        </p>
                                        <p className="text-gray-500">
                                            Bắt buộc
                                        </p>
                                    </div>
                                    <CircleAlert
                                        className="text-red-500"
                                        size={SIZE_ICON}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 bg-card-bg p-4">
                        <span className="col-span-2 font-medium">
                            Các metadata khác
                        </span>
                        <div className="col-span-4 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Thể loại chính *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p>Thể loại phụ</p>
                                    <p className="text-gray-500">Tuỳ chọn</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Nội dung nhạy cảm *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Ngôn ngữ bài hát *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Ngôn ngữ quốc gia *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Ngôn ngữ metadata *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-6 bg-card-bg p-4">
                        <span className="col-span-2 font-medium">Xuất bản</span>
                        <div className="col-span-4 flex flex-col gap-2">
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">Xuất bản *</p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">Vai trò *</p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="text-red-500">
                                        Tên nhạc sĩ *
                                    </p>
                                    <p className="text-gray-500">Bắt buộc</p>
                                </div>
                                <CircleAlert
                                    className="text-red-500"
                                    size={SIZE_ICON}
                                />
                            </div>
                            <div className="flex justify-between">
                                <div>
                                    <p>Tỷ lệ cổ phần</p>
                                    <p className="text-gray-500">Tuỳ chọn</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div>
            <p className="text-lg font-medium">Bài hát</p>
            <div className="flex flex-col gap-1">
                <Collapse
                    className="release-review-collapse !rounded-none !border-none !bg-card-bg !py-2"
                    items={items}
                    size="small"
                    bordered={false}
                />
                <Collapse
                    className="release-review-collapse !rounded-none !border-none !bg-card-bg !py-2"
                    items={items2}
                    size="small"
                    bordered={false}
                />
            </div>
        </div>
    );
}
