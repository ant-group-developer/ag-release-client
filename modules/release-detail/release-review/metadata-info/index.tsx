import { SIZE_ICON } from '@/constants/common';
import { CircleAlert } from 'lucide-react';
type Props = {};

export default function MetadataInfo({}: Props) {
    return (
        <div>
            <p className="text-lg font-medium">MetaData</p>
            <div className="flex flex-col gap-1">
                <div className="bg-card-bg p-4">
                    <p className="text-base font-medium">Thông tin chung</p>
                </div>

                <div className="grid grid-cols-6 bg-card-bg p-4">
                    <span className="col-span-2 font-medium">
                        Tên phát hành
                    </span>
                    <div className="col-span-4 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-red-500">Tên phát hành *</p>
                                <p className="text-gray-500">Bắt buộc</p>
                            </div>
                            <CircleAlert
                                className="text-red-500"
                                size={SIZE_ICON}
                            />
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <p className="text-red-500">Tên hiển thị *</p>
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
                    <span className="col-span-2 font-medium">Nghệ sĩ</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-red-500">Nghệ sĩ chính *</p>
                                <p className="text-gray-500">Bắt buộc</p>
                            </div>
                            <CircleAlert
                                className="text-red-500"
                                size={SIZE_ICON}
                            />
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <p>Nghệ sĩ phụ </p>
                                <p className="text-gray-500">Tuỳ chọn</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-6 bg-card-bg p-4">
                    <span className="col-span-2 font-medium">Thể loại</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-red-500">Thể loại chính *</p>
                                <p className="text-gray-500">Bắt buộc</p>
                            </div>
                            <CircleAlert
                                className="text-red-500"
                                size={SIZE_ICON}
                            />
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <p>Thể loại phụ </p>
                                <p className="text-gray-500">Tuỳ chọn</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-6 bg-card-bg p-4">
                    <span className="col-span-2 font-medium">Ngôn ngữ</span>
                    <div className="col-span-4 flex flex-col gap-2">
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
                    <span className="col-span-2 font-medium">Label</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <div>
                                <p>Label </p>
                                <p className="text-gray-500">Tuỳ chọn</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-6 bg-card-bg p-4">
                    <span className="col-span-2 font-medium">UPC</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <div>
                                <p>UPC </p>
                                <p className="text-gray-500">Tuỳ chọn</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-6 bg-card-bg p-4">
                    <span className="col-span-2 font-medium">ID danh mục</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <div>
                                <p>ID danh mục </p>
                                <p className="text-gray-500">Tuỳ chọn</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-6 bg-card-bg p-4">
                    <span className="col-span-2 font-medium">Bản quyền</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-red-500">
                                    Năm cấp bản quyền tác phẩm *
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
                                    Năm cấp bản quyền ghi âm *
                                </p>
                                <p className="text-gray-500">Tuỳ chọn</p>
                            </div>
                            <CircleAlert
                                className="text-red-500"
                                size={SIZE_ICON}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
