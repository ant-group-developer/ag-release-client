'use client';

import { PATH_PARAMS } from '@/enums/routes';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import {
    Button,
    Card,
    Form,
    Input,
    Modal,
    notification,
    Popconfirm,
    Table,
    Tag,
    theme,
} from 'antd';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    ExternalLink,
    FileText,
    Music,
    Shield,
    XCircle,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Định nghĩa Enums & Hằng số
enum EXECUTION_STATUS {
    PENDING = 'pending',
    EXECUTED = 'executed',
    REJECTED = 'rejected',
}

interface AuditLog {
    id: string;
    actor: string;
    action: string;
    status: EXECUTION_STATUS;
    timestamp: string;
    note?: string;
}

const LOCAL_STORAGE_KEY_PREFIX = 'ag_release_execution_';
const MOCK_ADMIN_NAME = 'System Administrator';

export default function SystemReviewTab() {
    const messages = useTranslations();
    const params = useParams();
    const { token } = theme.useToken();

    const releaseId = params[PATH_PARAMS.RELEASE_ID]
        ? `${params[PATH_PARAMS.RELEASE_ID]}`
        : '';

    // Lấy dữ liệu thực tế của Release
    const { releaseData, isLoading: isReleaseLoading } =
        useGetDetailRelease(releaseId);

    // Trạng thái cục bộ của tiến trình duyệt
    const [executionStatus, setExecutionStatus] = useState<EXECUTION_STATUS>(
        EXECUTION_STATUS.PENDING
    );
    const [rejectionReason, setRejectionReason] = useState<string>('');
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    // Trạng thái modal từ chối
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectForm] = Form.useForm();

    // Tải dữ liệu lưu trữ từ localStorage
    useEffect(() => {
        if (!releaseId) return;

        const savedData = localStorage.getItem(
            `${LOCAL_STORAGE_KEY_PREFIX}${releaseId}`
        );

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setExecutionStatus(parsed.status || EXECUTION_STATUS.PENDING);
                setRejectionReason(parsed.rejectionReason || '');
                setAuditLogs(parsed.auditLogs || []);
            } catch (e) {
                console.error('Error parsing saved execution status', e);
            }
        } else {
            // Giá trị mặc định ban đầu
            setExecutionStatus(EXECUTION_STATUS.PENDING);
            setRejectionReason('');
            setAuditLogs([
                {
                    id: '1',
                    actor: 'System',
                    action: 'Khởi tạo tiến trình kiểm duyệt phát hành',
                    status: EXECUTION_STATUS.PENDING,
                    timestamp: new Date().toLocaleString(),
                    note: 'Bản phát hành đã sẵn sàng để kiểm duyệt hệ thống.',
                },
            ]);
        }
    }, [releaseId]);

    // Lưu dữ liệu vào localStorage
    const saveToStorage = (
        status: EXECUTION_STATUS,
        reason: string,
        logs: AuditLog[]
    ) => {
        localStorage.setItem(
            `${LOCAL_STORAGE_KEY_PREFIX}${releaseId}`,
            JSON.stringify({ status, rejectionReason: reason, auditLogs: logs })
        );
    };

    // Xử lý duyệt thực thi
    const handleApprove = () => {
        const newLogs: AuditLog[] = [
            {
                id: Date.now().toString(),
                actor: MOCK_ADMIN_NAME,
                action: 'Duyệt & Cho phép thực thi',
                status: EXECUTION_STATUS.EXECUTED,
                timestamp: new Date().toLocaleString(),
                note: 'Đã duyệt điều kiện phân phối DDEX hoàn tất. Hệ thống bắt đầu đẩy nhạc lên các nền tảng DSPs.',
            },
            ...auditLogs,
        ];
        setExecutionStatus(EXECUTION_STATUS.EXECUTED);
        setAuditLogs(newLogs);
        saveToStorage(EXECUTION_STATUS.EXECUTED, '', newLogs);

        notification.success({
            message: 'Thành công',
            description: 'Đã phê duyệt và thực thi bản phát hành thành công!',
        });
    };

    // Xử lý từ chối
    const handleRejectSubmit = (values: { reason: string }) => {
        const newLogs: AuditLog[] = [
            {
                id: Date.now().toString(),
                actor: MOCK_ADMIN_NAME,
                action: 'Từ chối thực thi phát hành',
                status: EXECUTION_STATUS.REJECTED,
                timestamp: new Date().toLocaleString(),
                note: `Lý do từ chối: ${values.reason}`,
            },
            ...auditLogs,
        ];
        setExecutionStatus(EXECUTION_STATUS.REJECTED);
        setRejectionReason(values.reason);
        setAuditLogs(newLogs);
        saveToStorage(EXECUTION_STATUS.REJECTED, values.reason, newLogs);
        setIsRejectModalOpen(false);
        rejectForm.resetFields();

        notification.warning({
            message: 'Đã từ chối',
            description: 'Đã cập nhật trạng thái từ chối thực thi phát hành.',
        });
    };

    // Phục hồi lại trạng thái chờ duyệt (để test dễ dàng)
    const handleReset = () => {
        const newLogs: AuditLog[] = [
            {
                id: Date.now().toString(),
                actor: MOCK_ADMIN_NAME,
                action: 'Đặt lại trạng thái kiểm duyệt',
                status: EXECUTION_STATUS.PENDING,
                timestamp: new Date().toLocaleString(),
                note: 'Khôi phục trạng thái bản phát hành về Chờ xử lý.',
            },
            ...auditLogs,
        ];
        setExecutionStatus(EXECUTION_STATUS.PENDING);
        setRejectionReason('');
        setAuditLogs(newLogs);
        saveToStorage(EXECUTION_STATUS.PENDING, '', newLogs);

        notification.info({
            message: 'Đã khôi phục',
            description: 'Đã đặt lại trạng thái kiểm duyệt thành công.',
        });
    };

    // Render tag trạng thái
    const renderStatusTag = (status: EXECUTION_STATUS) => {
        switch (status) {
            case EXECUTION_STATUS.EXECUTED:
                return (
                    <Tag color="success">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <CheckCircle size={14} />
                            ĐÃ DUYỆT THỰC THI
                        </span>
                    </Tag>
                );
            case EXECUTION_STATUS.REJECTED:
                return (
                    <Tag color="error">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <XCircle size={14} />
                            ĐÃ TỪ CHỐI THỰC THI
                        </span>
                    </Tag>
                );
            default:
                return (
                    <Tag color="processing">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap">
                            <Clock size={14} />
                            ĐANG CHỜ DUYỆT
                        </span>
                    </Tag>
                );
        }
    };

    // Cấu hình cột cho bảng lịch sử kiểm duyệt (Audit Log)
    const auditColumns = [
        {
            title: 'Thời gian',
            dataIndex: 'timestamp',
            key: 'timestamp',
            width: '20%',
        },
        {
            title: 'Người thực hiện',
            dataIndex: 'actor',
            key: 'actor',
            width: '20%',
            render: (text: string) => (
                <span className="font-semibold text-gray-700">{text}</span>
            ),
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            width: '25%',
        },
        {
            title: 'Chi tiết / Ghi chú',
            dataIndex: 'note',
            key: 'note',
            render: (text: string) => (
                <span className="italic text-gray-500">{text || 'N/A'}</span>
            ),
        },
    ];

    // Data quét nhạc từ ARC giả định cho từng Track
    const getMockAcrData = (
        trackId: string,
        trackTitle: string,
        index: number
    ) => {
        interface MatchLink {
            youtube?: string;
            spotify?: string;
            deezer?: string;
        }

        interface Match {
            title: string;
            artist: string;
            score: number;
            isrc: string;
            label: string;
            album: string;
            sampleRange: string;
            dbRange: string;
            links: MatchLink;
        }

        interface AcrData {
            status: string;
            statusLabel: string;
            color: string;
            matches: Match[];
        }

        // Track đầu tiên cho trùng bản quyền một phần để demo trực quan
        if (index === 0) {
            const data: AcrData = {
                status: 'warning',
                statusLabel: 'Cảnh báo bản quyền',
                color: 'warning',
                matches: [
                    {
                        title: `${trackTitle} (Original Instrumental)`,
                        artist: 'Classic Records Band',
                        score: 96,
                        isrc: 'USUM71890123',
                        label: 'Universal Music Group',
                        album: 'Global Sounds 2018',
                        sampleRange: '00:15 - 00:48',
                        dbRange: '02:10 - 02:43',
                        links: {
                            youtube: 'https://youtube.com',
                            spotify: 'https://spotify.com',
                            deezer: 'https://deezer.com',
                        },
                    },
                ],
            };
            return data;
        }
        // Track thứ hai cho trùng bản quyền nhẹ
        if (index === 1) {
            const data: AcrData = {
                status: 'warning',
                statusLabel: 'Trùng khớp nhẹ',
                color: 'warning',
                matches: [
                    {
                        title: 'Sunset Beach Remake',
                        artist: 'Chillout DJ Set',
                        score: 82,
                        isrc: 'DEUM71900456',
                        label: 'Independent Records',
                        album: 'Summer Hits Lofi',
                        sampleRange: '01:05 - 01:25',
                        dbRange: '00:05 - 00:25',
                        links: {
                            spotify: 'https://spotify.com',
                        },
                    },
                ],
            };
            return data;
        }
        // Các track khác an toàn
        const defaultData: AcrData = {
            status: 'finished',
            statusLabel: 'An toàn',
            color: 'success',
            matches: [],
        };
        return defaultData;
    };

    return (
        <div className="flex flex-col gap-6 pb-12">
            {/* CARD 1: KHUNG DUYỆT THỰC THI */}
            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                style={{ backgroundColor: token.colorBgContainer }}
                title={
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                        <Shield className="text-blue-500" size={20} />
                        <span>Duyệt phát hành</span>
                    </div>
                }
            >
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-12">
                    <div className="flex flex-col gap-2 md:col-span-8">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-500">
                                Trạng thái hiện tại:
                            </span>
                            {renderStatusTag(executionStatus)}
                        </div>

                        {rejectionReason && (
                            <div className="mt-2 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-red-700">
                                <AlertTriangle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />
                                <div>
                                    <span className="font-bold">
                                        Lý do từ chối:{' '}
                                    </span>
                                    <span>{rejectionReason}</span>
                                </div>
                            </div>
                        )}
                        <p className="mt-1 text-xs text-gray-400">
                            * Lưu ý: Khi duyệt thực thi, bản phát hành sẽ được
                            xác nhận đủ điều kiện và gửi sang tiến trình nén/đẩy
                            metadata DDEX sang các DSPs đã chọn.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2 md:col-span-4">
                        {executionStatus === EXECUTION_STATUS.PENDING ? (
                            <>
                                <Popconfirm
                                    title="Xác nhận duyệt thực thi?"
                                    description="Hành động này sẽ duyệt phát hành và bắt đầu tiến trình đẩy nhạc."
                                    onConfirm={handleApprove}
                                    okText="Đồng ý"
                                    cancelText="Hủy"
                                >
                                    <Button
                                        type="primary"
                                        className="flex items-center gap-1 border-none bg-emerald-600 font-semibold hover:bg-emerald-500"
                                    >
                                        <CheckCircle size={16} />
                                        Duyệt thực thi
                                    </Button>
                                </Popconfirm>

                                <Button
                                    danger
                                    onClick={() => setIsRejectModalOpen(true)}
                                    className="flex items-center gap-1 font-semibold"
                                >
                                    <XCircle size={16} />
                                    Từ chối duyệt
                                </Button>
                            </>
                        ) : (
                            <Button
                                onClick={handleReset}
                                type="dashed"
                                className="flex items-center gap-1"
                            >
                                <Clock size={14} />
                                Đặt lại trạng thái chờ duyệt
                            </Button>
                        )}
                    </div>
                </div>

                {/* BẢNG LỊCH SỬ DUYỆT */}
                <div className="mt-6 border-t pt-6">
                    <div className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600">
                        <FileText size={16} />
                        Lịch sử kiểm duyệt hệ thống
                    </div>
                    <Table
                        columns={auditColumns}
                        dataSource={auditLogs}
                        rowKey="id"
                        pagination={false}
                        size="small"
                        bordered
                    />
                </div>
            </Card>

            {/* CARD 2: KẾT QUẢ QUÉT NHẠC TỪ ARC (ACRCLOUD) */}
            <Card
                className="rounded-xl border border-gray-100 shadow-sm"
                style={{ backgroundColor: token.colorBgContainer }}
                title={
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-800">
                        <Music className="text-indigo-500" size={20} />
                        <span>KẾT QUẢ QUÉT BẢN QUYỀN ARC (ACRCLOUD DATA)</span>
                    </div>
                }
            >
                {isReleaseLoading ? (
                    <p className="py-6 text-center text-gray-400">
                        Đang tải danh sách bài hát...
                    </p>
                ) : !releaseData?.tracks || releaseData.tracks.length === 0 ? (
                    <p className="py-6 text-center text-gray-400">
                        Không tìm thấy bài hát nào trong bản phát hành này.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-gray-500">
                            Hệ thống tự động thực hiện đối soát âm thanh của
                            từng track trong Release với kho dữ liệu bản quyền
                            thế giới ACRCloud.
                        </p>

                        {releaseData.tracks.map((track, index) => {
                            const acrData = getMockAcrData(
                                track.id,
                                track.title,
                                index
                            );

                            return (
                                <div
                                    key={track.id}
                                    className="rounded-lg border bg-gray-50/50 p-4 transition-colors hover:bg-gray-50"
                                >
                                    {/* Header của bài hát */}
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-base font-bold text-gray-800">
                                                    {track.title}
                                                </h4>
                                                <span className="text-xs text-gray-400">
                                                    ISRC: {track.isrc || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400">
                                                ACR status:
                                            </span>
                                            <Tag
                                                color={acrData.color}
                                                className="px-2 py-0.5 font-semibold uppercase"
                                            >
                                                {acrData.statusLabel}
                                            </Tag>
                                        </div>
                                    </div>

                                    {/* Phần nội dung quét */}
                                    {acrData.matches.length === 0 ? (
                                        <div className="flex items-center gap-2 py-1 text-sm font-medium text-emerald-600">
                                            <CheckCircle size={16} />
                                            <span>
                                                Không phát hiện vi phạm bản
                                                quyền. Bài hát đạt kiểm định an
                                                toàn âm thanh.
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-1.5 text-sm font-bold text-amber-600">
                                                <AlertTriangle size={16} />
                                                <span>
                                                    Phát hiện trùng khớp âm
                                                    thanh trùng lặp (
                                                    {acrData.matches.length} kết
                                                    quả):
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {acrData.matches.map(
                                                    (match, mIdx) => (
                                                        <div
                                                            key={mIdx}
                                                            className="grid grid-cols-1 gap-4 rounded-lg border border-amber-100 bg-white p-3 text-sm md:grid-cols-2"
                                                        >
                                                            <div className="space-y-1">
                                                                <div>
                                                                    <span className="text-gray-400">
                                                                        Tên bài
                                                                        hát gốc:
                                                                    </span>{' '}
                                                                    <span className="font-semibold text-gray-800">
                                                                        {
                                                                            match.title
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">
                                                                        Nghệ sĩ:
                                                                    </span>{' '}
                                                                    <span className="font-semibold text-gray-800">
                                                                        {
                                                                            match.artist
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">
                                                                        Album:
                                                                    </span>{' '}
                                                                    <span className="text-gray-600">
                                                                        {
                                                                            match.album
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">
                                                                        Nhãn
                                                                        đĩa:
                                                                    </span>{' '}
                                                                    <span className="text-gray-600">
                                                                        {
                                                                            match.label
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <div>
                                                                    <span className="text-gray-400">
                                                                        ISRC
                                                                        gốc:
                                                                    </span>{' '}
                                                                    <span className="font-mono font-medium text-gray-700">
                                                                        {
                                                                            match.isrc
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">
                                                                        Khoảng
                                                                        thời
                                                                        gian
                                                                        khớp
                                                                        trong
                                                                        bài:
                                                                    </span>{' '}
                                                                    <span className="font-semibold text-gray-700">
                                                                        {
                                                                            match.sampleRange
                                                                        }
                                                                    </span>
                                                                </div>
                                                                <div>
                                                                    <span className="text-gray-400">
                                                                        Độ chính
                                                                        xác
                                                                        (Score):
                                                                    </span>{' '}
                                                                    <Tag
                                                                        color="orange"
                                                                        className="ml-1 font-bold"
                                                                    >
                                                                        {
                                                                            match.score
                                                                        }
                                                                        /100
                                                                    </Tag>
                                                                </div>

                                                                {/* Nút nghe thử */}
                                                                <div className="flex gap-2 pt-2">
                                                                    {match.links
                                                                        .youtube && (
                                                                        <a
                                                                            href={
                                                                                match
                                                                                    .links
                                                                                    .youtube
                                                                            }
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            <Button
                                                                                size="small"
                                                                                type="default"
                                                                                className="flex items-center gap-1 text-xs"
                                                                            >
                                                                                <ExternalLink
                                                                                    size={
                                                                                        12
                                                                                    }
                                                                                />
                                                                                YouTube
                                                                            </Button>
                                                                        </a>
                                                                    )}
                                                                    {match.links
                                                                        .spotify && (
                                                                        <a
                                                                            href={
                                                                                match
                                                                                    .links
                                                                                    .spotify
                                                                            }
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            <Button
                                                                                size="small"
                                                                                type="default"
                                                                                className="flex items-center gap-1 text-xs"
                                                                            >
                                                                                <ExternalLink
                                                                                    size={
                                                                                        12
                                                                                    }
                                                                                />
                                                                                Spotify
                                                                            </Button>
                                                                        </a>
                                                                    )}
                                                                    {match.links
                                                                        .deezer && (
                                                                        <a
                                                                            href={
                                                                                match
                                                                                    .links
                                                                                    .deezer
                                                                            }
                                                                            target="_blank"
                                                                            rel="noreferrer"
                                                                        >
                                                                            <Button
                                                                                size="small"
                                                                                type="default"
                                                                                className="flex items-center gap-1 text-xs"
                                                                            >
                                                                                <ExternalLink
                                                                                    size={
                                                                                        12
                                                                                    }
                                                                                />
                                                                                Deezer
                                                                            </Button>
                                                                        </a>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            {/* MODAL TỪ CHỐI DUYỆT */}
            <Modal
                title={
                    <div className="flex items-center gap-1.5 font-bold text-red-600">
                        <AlertTriangle size={18} />
                        <span>TỪ CHỐI THỰC THI PHÁT HÀNH</span>
                    </div>
                }
                open={isRejectModalOpen}
                onCancel={() => setIsRejectModalOpen(false)}
                okText="Xác nhận từ chối"
                okButtonProps={{ danger: true }}
                cancelText="Hủy"
                onOk={() => rejectForm.submit()}
                destroyOnClose
            >
                <div className="py-2">
                    <p className="mb-4 text-sm text-gray-500">
                        Vui lòng nhập lý do từ chối phê duyệt. Lý do này sẽ được
                        ghi nhận vào lịch sử hệ thống và gửi thông báo tới chủ
                        sở hữu bản phát hành.
                    </p>
                    <Form
                        form={rejectForm}
                        layout="vertical"
                        onFinish={handleRejectSubmit}
                    >
                        <Form.Item
                            name="reason"
                            label={
                                <span className="font-semibold text-gray-700">
                                    Lý do từ chối
                                </span>
                            }
                            rules={[
                                {
                                    required: true,
                                    message:
                                        'Vui lòng nhập lý do từ chối duyệt!',
                                },
                            ]}
                        >
                            <Input.TextArea
                                placeholder="Ví dụ: Bài hát số 1 trùng bản quyền nghiêm trọng với tác phẩm đã được phân phối trên Youtube ContentID..."
                                rows={4}
                                maxLength={250}
                                showCount
                            />
                        </Form.Item>
                    </Form>
                </div>
            </Modal>
        </div>
    );
}
