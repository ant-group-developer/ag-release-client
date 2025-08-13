import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER, SCREEN } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useGetScanStatus } from '../../hooks/use-get-scan-status';
import { TrackScanStatusDataFilter } from '../../types';
import AcrScanHistoryTable from '../table/acr-scan-history-table';

type Props = Omit<AppModalProps, 'children'> & {};

export default function AcrCloudScanHistoryModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const { dataFilter, onChangePage } = useFilter<TrackScanStatusDataFilter>({
        page: 1,
        pageSize: PAGE_SIZE,
        orderBy: ORDER.DESC,
        fieldOrder: 'createdAt',
    });
    const { scanStatusData, isLoading } = useGetScanStatus(dataFilter);

    return (
        <AppModal
            open
            className="!top-4"
            title={`${messages('common.history')} ${messages('common.scan').toLowerCase()}  ACRCloud`}
            onCancel={closeModal}
            width={1400}
            height={800}
            footer={null}
            {...props}
        >
            <Spin spinning={isLoading}>
                <div className="max-h-[800px] min-h-[300px] overflow-hidden">
                    <AcrScanHistoryTable
                        dataSource={scanStatusData?.items}
                        dataFilter={dataFilter}
                        pagination={{
                            pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                            current: scanStatusData.metadata.currentPage,
                            total: scanStatusData.metadata.totalItems,
                        }}
                        scroll={{ x: SCREEN.MD, y: 600 }}
                    />
                    <AppPagination
                        className="border-t"
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
