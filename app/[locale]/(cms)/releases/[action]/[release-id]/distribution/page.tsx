'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { SESSION_STORAGE_KEY } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import {
    defaultVisibleColumnsDistribution,
    distributionData,
} from '@/modules/distribution/constants';
import {
    DISTRIBUTION_COLUMNS_DISPLAY,
    DISTRIBUTION_STATUS,
} from '@/modules/distribution/enum';
import { DistributionDataFilter } from '@/modules/distribution/types';
import DistributionHeader from '@/modules/release-detail/release-distribution/components/header';
import DistributionStatus from '@/modules/release-detail/release-distribution/components/header-action/distribution-status';
import DistributionTable from '@/modules/release-detail/release-distribution/components/table';
import { TYPE_MODAL_RELEASE_DISTRIBUTION } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { Button } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';
type Props = {};

export default function Distribution({}: Props) {
    const messages = useTranslations();
    const [selectedRow, setSelectedRow] = useState<Key[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<
        DISTRIBUTION_COLUMNS_DISPLAY[]
    >(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem(
                SESSION_STORAGE_KEY.VISIBLE_COLUMNS_DISTRIBUTION
            );
            if (!stored) return defaultVisibleColumnsDistribution;
            const { value, timestamp } = JSON.parse(stored) as {
                value: DISTRIBUTION_COLUMNS_DISPLAY[];
                timestamp: string;
            };

            if (dayjs().diff(dayjs(timestamp), 'day') >= 10) {
                sessionStorage.removeItem(
                    SESSION_STORAGE_KEY.VISIBLE_COLUMNS_DISTRIBUTION
                );
                return defaultVisibleColumnsDistribution;
            }

            return value;
        }
        return defaultVisibleColumnsDistribution;
    });

    const openModal = useModalStore((state) => state.openModal);

    const handleSelectedRow = (selectedRowKeys: Key[]) => {
        setSelectedRow(selectedRowKeys);
    };

    const rowSelection = {
        selectedRow,
        onChange: handleSelectedRow,
    };

    const handleChangeVisibleColumns = (
        columns: DISTRIBUTION_COLUMNS_DISPLAY[]
    ) => {
        setVisibleColumns(columns);
    };
    const {
        dataFilter,
        onChangeFilter,
        canClearFilter,
        removeFilter,
        onChangePage,
    } = useFilter<DistributionDataFilter>({
        page: 1,
        pageSize: 21,
    });

    // const { height, width } = useWindowSize();
    // const isSmallDevice = Number(width) <= SCREEN.MD;
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const validationErrors = useReleaseFormStore(
        (state) => state.validationErrors
    );
    const errorsLength = validationErrors?.length;
    const releaseId = formValues?.id || '';
    const router = useRouter();

    // const scrollY = () => {
    //     if (isSmallDevice) return undefined;
    //     if (!height) return undefined;
    //     const minHeight = 300;
    //     const header = 64;
    //     const pageHeader = 204;
    //     const pageAction = 49;
    //     const pageFilter = 49;
    //     const pagination = 58;
    //     const headerTable = 39;
    //     const headerFooterHeight =
    //         header +
    //         pageHeader +
    //         pageFilter +
    //         pagination +
    //         headerTable +
    //         pageAction;
    //     const value = height - headerFooterHeight;
    //     if (value > minHeight) return value;
    //     return minHeight;
    // };

    const handleRefresh = () => {};

    // const facebookOptions = [
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>Claim Ad Earnings</span>
    //                 <IconInfoTooltip title=" Quét tất cả video/câu chuyện sử dụng nhạc của bạn và bật kiếm tiền (nhận tiền bản quyền)" />
    //             </p>
    //         ),
    //         value: 'Claim Ad Earnings',
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>Block</span>
    //                 <IconInfoTooltip title="Quét tất cả video/câu chuyện sử dụng nhạc của bạn và chặn chúng." />
    //             </p>
    //         ),
    //         value: 'Block',
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>Monitor</span>
    //                 <IconInfoTooltip title="Quét tất cả video/câu chuyện sử dụng nhạc của bạn nhưng không bật kiếm tiền. Chỉ thu thập dữ liệu phân tích." />
    //             </p>
    //         ),
    //         value: 'Monitor',
    //     },
    // ];

    // const tiktokOptions = [
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>NoTiktokScanning</span>
    //                 <IconInfoTooltip title="Không quét TikTok để tìm các video chứa nhạc của bạn vì bản thu này không đáp ứng đầy đủ các yêu cầu (xem Thuộc tính bản nhạc). Lưu ý rằng nhạc của bạn vẫn sẽ có sẵn để người dùng TikTok thêm vào video của họ." />
    //             </p>
    //         ),
    //         value: 'NoTiktokScanning',
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>Block</span>
    //                 <IconInfoTooltip title="Quét tất cả video/câu chuyện sử dụng nhạc của bạn và chặn chúng." />
    //             </p>
    //         ),
    //         value: 'Block',
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>Monetize</span>
    //                 <IconInfoTooltip title="Quét tất cả các video sử dụng nhạc của bạn và bật kiếm tiền cho chúng (nhận tiền bản quyền)." />
    //             </p>
    //         ),
    //         value: 'Monitor',
    //     },
    // ];

    // const youtubeOptions = [
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>Monetize in all countries</span>
    //                 <IconInfoTooltip title="Quét tất cả các video sử dụng nhạc của bạn và bật kiếm tiền cho chúng (nhận tiền bản quyền)." />
    //             </p>
    //         ),
    //         value: 'Monetize in all',
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>Track in all countries</span>
    //                 <IconInfoTooltip title="Quét tất cả các video sử dụng nhạc của bạn nhưng không bật kiếm tiền. Chỉ thu thập dữ liệu phân tích về chúng." />
    //             </p>
    //         ),
    //         value: 'rack in all countries',
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>Block in all countries</span>
    //                 <IconInfoTooltip title="Quét tất cả các video sử dụng nhạc của bạn và chặn chúng." />
    //             </p>
    //         ),
    //         value: 'Block in all countries',
    //     },
    // ];

    // const amazonOptions = [
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>$0.6</span>
    //                 <span>Back</span>
    //             </p>
    //         ),
    //         value: 0.6,
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>$0.8</span>
    //                 <span>Mid</span>
    //             </p>
    //         ),
    //         value: 0.8,
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>$1.2</span>
    //                 <span>Front</span>
    //             </p>
    //         ),
    //         value: 1.2,
    //     },
    // ];

    // const appleMusicOptions = [
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>$0.6</span>
    //                 <span>Back</span>
    //             </p>
    //         ),
    //         value: 0.6,
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>$0.8</span>
    //                 <span>Mid</span>
    //             </p>
    //         ),
    //         value: 0.8,
    //     },
    //     {
    //         label: (
    //             <p className="flex items-center justify-between">
    //                 <span>$1.2</span>
    //                 <span>Front</span>
    //             </p>
    //         ),
    //         value: 1.2,
    //     },
    // ];

    const dataTable = distributionData.filter((item) => {
        return selectedRow.includes(item.id);
    });

    const handleDistribution = () => {
        setFormValues({
            ...formValues,
            platforms: selectedRow as string[],
        });
        closeModal();
        router.push(`/releases/detail/${releaseId}/review`);
    };

    return (
        <div className="flex h-full flex-col justify-between">
            <div className="">
                <div className="flex justify-between border-b">
                    <DistributionStatus
                        onChangeFilter={onChangeFilter}
                        value={dataFilter.status ?? DISTRIBUTION_STATUS.ALL}
                    />
                    {selectedRow.length > 0 && (
                        <div className="flex items-center gap-4 px-4 font-medium">
                            <Button
                                onClick={() => {
                                    openModal(
                                        TYPE_MODAL_RELEASE_DISTRIBUTION.DISTRIBUTION
                                    );
                                }}
                                className=""
                                type="primary"
                                disabled={errorsLength > 0}
                            >
                                <span>
                                    Phân phối {selectedRow.length}/
                                    {distributionData.length}
                                </span>
                            </Button>
                            <Button
                                onClick={() => {
                                    openModal(
                                        TYPE_MODAL_RELEASE_DISTRIBUTION.TAKE_DOWN
                                    );
                                }}
                                danger
                                disabled={errorsLength > 0}
                            >
                                <span>
                                    Gỡ xuống {selectedRow.length}/
                                    {distributionData.length}
                                </span>
                            </Button>
                        </div>
                    )}
                </div>

                <DistributionHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                    handleChangeVisibleColumns={handleChangeVisibleColumns}
                    visibleColumn={visibleColumns}
                />

                <DistributionTable
                    dataSource={distributionData}
                    scroll={{ x: 'max-content' }}
                    rowSelection={rowSelection}
                    size="large"
                />
            </div>

            {typeModal === TYPE_MODAL_RELEASE_DISTRIBUTION.DISTRIBUTION && (
                // <DistributionReleaseModal platformIds={selectedRow} />
                <AppConfirm
                    open
                    onOk={handleDistribution}
                    onCancel={closeModal}
                    modalTitle="Phát hành"
                    paragraph="Bạn có chắc chắn muốn phát hành trên nền tảng này không?"
                />
            )}

            {typeModal === TYPE_MODAL_RELEASE_DISTRIBUTION.TAKE_DOWN && (
                <AppConfirm
                    open
                    onOk={closeModal}
                    onCancel={closeModal}
                    modalTitle="Gỡ khỏi nền tảng"
                    paragraph="Bạn có chắc chắn muốn gỡ khỏi nền tảng này không?"
                />
            )}

            <AppPagination
                className="border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={distributionData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 35]}
            />
        </div>
    );
}
