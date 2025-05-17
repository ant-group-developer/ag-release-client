import { AlertCircle, AlertTriangle } from 'lucide-react';

type Props = {};

export default function LeftSidebar({}: Props) {
    // Giả lập số lượng cảnh báo và lỗi (sau này có thể lấy từ API hoặc state thực tế)
    const warningCount = 3;
    const errorCount = 1;

    return (
        <div className="w-[280px] border-r border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-4 text-lg font-medium">Thông tin bổ sung</h3>

            <div className="space-y-4">
                <div className="rounded-md bg-white p-3 shadow-sm">
                    <h4 className="mb-2 text-sm font-medium">Trạng thái</h4>
                    <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-yellow-400"></div>
                        <span className="text-sm">Đang xử lý</span>
                    </div>
                </div>

                <div className="rounded-md bg-white p-3 shadow-sm">
                    <h4 className="mb-2 text-sm font-medium">
                        Người phụ trách
                    </h4>
                    <div className="flex items-center">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                            <span className="text-xs font-medium">NH</span>
                        </div>
                        <span className="text-sm">Nguyễn Hào</span>
                    </div>
                </div>

                <div className="rounded-md bg-white p-3 shadow-sm">
                    <h4 className="mb-2 flex items-center text-sm font-medium">
                        <span>Cảnh báo & Lỗi</span>
                        {warningCount > 0 && (
                            <span className="ml-2 flex items-center text-xs text-yellow-600">
                                <AlertTriangle size={14} className="mr-1" />
                                {warningCount}
                            </span>
                        )}
                        {errorCount > 0 && (
                            <span className="ml-2 flex items-center text-xs text-red-600">
                                <AlertCircle size={14} className="mr-1" />
                                {errorCount}
                            </span>
                        )}
                    </h4>
                    <div className="space-y-2">
                        {warningCount > 0 && (
                            <div className="rounded bg-yellow-50 p-2 text-xs">
                                <div className="flex items-center text-yellow-700">
                                    <AlertTriangle size={14} className="mr-1" />
                                    <p className="font-medium">
                                        Thiếu thông tin phân phối
                                    </p>
                                </div>
                                <p className="mt-1 text-yellow-600">
                                    Vui lòng bổ sung thông tin phân phối
                                </p>
                            </div>
                        )}
                        {errorCount > 0 && (
                            <div className="rounded bg-red-50 p-2 text-xs">
                                <div className="flex items-center text-red-700">
                                    <AlertCircle size={14} className="mr-1" />
                                    <p className="font-medium">Thiếu bài hát</p>
                                </div>
                                <p className="mt-1 text-red-600">
                                    Phát hành phải có ít nhất 1 bài hát
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-md bg-white p-3 shadow-sm">
                    <h4 className="mb-2 text-sm font-medium">
                        Lịch sử thay đổi
                    </h4>
                    <div className="space-y-2">
                        <div className="text-xs">
                            <p className="font-medium">17/05/2025 - 13:11</p>
                            <p className="text-gray-600">
                                Cập nhật thông tin bài hát
                            </p>
                        </div>
                        <div className="text-xs">
                            <p className="font-medium">16/05/2025 - 09:45</p>
                            <p className="text-gray-600">Tạo phát hành mới</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-md bg-white p-3 shadow-sm">
                    <h4 className="mb-2 text-sm font-medium">Ghi chú</h4>
                    <textarea
                        className="h-24 w-full rounded-md border border-gray-200 p-2 text-sm"
                        placeholder="Thêm ghi chú..."
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
