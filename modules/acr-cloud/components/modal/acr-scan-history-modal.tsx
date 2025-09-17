import Refresh from '@/components/refresh';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useGetScanStatus } from '../../hooks/use-get-scan-status';
import { TrackScanStatusDataFilter } from '../../types';
import AcrScanHistoryTable from '../table/acr-scan-history-table';

type Props = Omit<AppModalProps, 'children'> & {};

export default function AcrCloudScanHistoryModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);

    const [dataFilter, setDataFilter] = useState<TrackScanStatusDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        orderBy: ORDER.DESC,
        fieldOrder: 'createdAt',
    });

    const onChangePage = useCallback((page: number, pageSize: number) => {
        setDataFilter((prev) => {
            const prevSize = prev.pageSize ?? PAGE_SIZE;
            const sizeChanged = pageSize !== prevSize;

            return {
                ...prev,
                page: sizeChanged ? 1 : page,
                pageSize,
            };
        });
    }, []);

    const { scanStatusData, isFetching, refetch, dataUpdatedAt } =
        useGetScanStatus(dataFilter);

    const renderTitle = () => {
        return (
            <div className="flex items-center justify-between pr-4">
                <span>{`${messages('common.history')} ${messages('common.scan').toLowerCase()}  ACRCloud`}</span>
                <div className="mr-6 text-sm">
                    <Refresh
                        handleRefresh={() => refetch()}
                        lastTimeUpdated={formattedDate(
                            dataUpdatedAt || new Date()
                        )}
                    />
                </div>
            </div>
        );
    };

    return (
        <AppModal
            open
            className="!top-16"
            title={renderTitle()}
            onCancel={closeModal}
            width={1400}
            height={800}
            footer={null}
            {...props}
        >
            <Spin spinning={isFetching}>
                <div className="max-h-[800px] overflow-hidden">
                    <AcrScanHistoryTable
                        dataSource={scanStatusData?.items}
                        dataFilter={dataFilter}
                        pagination={{
                            pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                            current: scanStatusData.metadata.currentPage,
                        }}
                        scroll={{ x: SCREEN.MD, y: 600 }}
                    />
                    <AppPagination
                        align="end"
                        current={scanStatusData?.metadata?.currentPage}
                        pageSize={dataFilter.pageSize}
                        total={scanStatusData?.metadata.totalItems}
                        onChange={onChangePage}
                        showTotalText
                        showSizeChanger
                        showQuickJumper
                        pageSizeOptions={PAGE_SIZE_OPTIONS}
                    />
                </div>
            </Spin>
        </AppModal>
    );
}
