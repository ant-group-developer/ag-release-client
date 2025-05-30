import { Progress } from 'antd';

type Props = {};

export default function ReviewProgress({}: Props) {
    return (
        <div>
            <p className="text-lg font-medium">Tiến trình nhập dữ liệu</p>
            <div className="grid grid-cols-12 px-8 py-4">
                <div className="col-span-2">
                    <Progress type="circle" percent={65} />
                </div>
                <div className="col-span-2 flex flex-col justify-center gap-4">
                    <span> Thông tin chính </span>
                    <span>Bài hát</span>
                    <span>Lịch phát hành</span>
                </div>
                <div className="col-span-8 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <Progress percent={30} showInfo={false} />
                        <span>3/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Progress percent={30} showInfo={false} />
                        <span>3/10</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Progress percent={30} showInfo={false} />
                        <span>3/10</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
