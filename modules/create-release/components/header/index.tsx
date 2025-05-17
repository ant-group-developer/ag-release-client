import { Radio } from 'antd';

type Props = {};

export default function CreateReleaseHeader({}: Props) {
    return (
        <div className="flex flex-col">
            <div className="flex justify-between px-4 py-4">
                <div className="flex gap-4">
                    <div className="flex h-[200px] w-[200px] items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-100">
                        <span className="text-gray-500">
                            Kéo thả ảnh vào đây
                        </span>
                    </div>
                    <div>
                        <div className="flex h-full flex-col gap-2">
                            <p className="text-sm font-medium">Label: AMG</p>
                            <p className="text-sm font-medium">
                                Tên phát hành: Hiphop-420
                            </p>
                            <p className="text-sm font-medium">Nghệ sĩ: MCK</p>
                            <p className="text-sm font-medium">
                                Thể loại: Hiphop
                            </p>
                            <p className="text-sm font-medium">
                                Ngôn ngữ: Việt Nam
                            </p>
                            <p className="text-sm font-medium">
                                Ngày phát hành: 20/05/2025
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="pb-2 text-xs font-medium">
                        Cập nhật cuối: Nguyễn Đình Hào | 13:11 17/05/2025
                    </p>
                    <div className="flex justify-end">
                        <Radio.Group defaultValue="edit">
                            <Radio.Button value="read">Đọc</Radio.Button>
                            <Radio.Button value="edit">Sửa</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
            </div>
        </div>
    );
}
