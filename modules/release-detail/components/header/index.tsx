import DndImageUpload from '@/components/ui/input/dnd-Image-upload';
import { Radio } from 'antd';

type Props = {};

export default function ReleaseDetailHeader({}: Props) {
    return (
        <div className="flex flex-col">
            {/* <div className="flex justify-center">
                <ReleaseDetailSteps />
            </div> */}

            <div className="flex justify-between px-4 pb-4">
                <div className="flex gap-4">
                    <div className="h-[250px] w-[250px]">
                        <DndImageUpload
                            maxCount={1}
                            accept="image/*"
                            placeholder="Kéo thả ảnh vào ô trống!"
                        />
                    </div>
                    <div>
                        <div className="flex h-full flex-col gap-2">
                            <div className="text-sm">
                                <span>Label: </span>
                                <span className="font-bold">AMG</span>
                            </div>
                            <div className="text-sm">
                                <span>Tên phát hành: </span>
                                <span className="font-bold">Hiphop-420</span>
                            </div>
                            <div className="text-sm">
                                <span>Nghệ sĩ: </span>
                                <span className="font-bold">MCK</span>
                            </div>
                            <div className="text-sm">
                                <span>Thể loại: </span>
                                <span className="font-bold">Hiphop</span>
                            </div>
                            <div className="text-sm">
                                <span>Ngôn ngữ: </span>
                                <span className="font-bold">Việt Nam</span>
                            </div>
                            <div className="text-sm">
                                <span>Ngày phát hành: </span>
                                <span className="font-bold">20/05/2025</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="pb-2 text-xs font-medium">
                        Cập nhật cuối: Nguyễn Đình Hào | 13:11 17/05/2025
                    </p>
                    <div className="flex justify-end">
                        <Radio.Group defaultValue="a">
                            <Radio.Button value="read">Đọc</Radio.Button>
                            <Radio.Button value="edit">Sửa</Radio.Button>
                        </Radio.Group>
                    </div>
                </div>
            </div>
        </div>
    );
}
