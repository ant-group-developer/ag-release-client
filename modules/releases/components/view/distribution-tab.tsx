'use client';

import AppPagination from '@/components/ui/pagination';
import {
    PAGE_SIZE_EXTRA_LARGE,
    PAGE_SIZE_OPTIONS,
} from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useElementHeightById } from '@/hooks/use-element-height-by-id';
import { useFilter } from '@/hooks/use-filter';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { useReleaseDistribute } from '@/modules/distribution/hooks/use-release-distribute';
import { RELEASE_DSP_TABLE_KEY } from '@/modules/release-dsp/enums';
import { useGetListReleaseDsp } from '@/modules/release-dsp/hooks/use-get-list-release-dsp';
import {
    ReleaseDspData,
    ReleaseDspDataFilter,
} from '@/modules/release-dsp/types';
import DistributionStatus from '@/modules/releases/components/release-detail/release-distribution/components/header-action/distribution-status';
import DistributionTable from '@/modules/releases/components/release-detail/release-distribution/components/table';
import { RELEASE_DETAIL_ACTION } from '@/modules/releases/helpers/link';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { ReleasesData } from '@/modules/releases/types';
import { theme } from 'antd';
import { useEffect, useState } from 'react';

type Props = {
    releaseData: ReleasesData;
};

export default function DistributionTab({ releaseData }: Props) {
    const setSelectedRow = useReleaseDistribute(
        (state) => state.setSelectedRows
    );
    const selectedRow = useReleaseDistribute((state) => state.selectedRows);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const setReleaseAction = useReleaseActionStore((state) => state.setAction);
    const [releaseDspStatus, setReleaseDspStatus] = useState<
        RELEASE_DSP_DELIVERY_STATUS | undefined
    >();
    const headerHeight = useElementHeightById('release-header');

    // const openModal = useModalStore((state) => state.openModal);
    // const dataEdit = useModalStore((state) => state.dataEdit);
    // const typeModal = useModalStore((state) => state.typeModal);
    // const closeModal = useModalStore((state) => state.closeModal);

    const { token } = theme.useToken();
    // const { isDark } = useThemeMode();
    // const messages = useTranslations();

    // Thiết lập hành động là READ để các bảng rơi vào chế độ chỉ đọc
    useEffect(() => {
        setReleaseAction(RELEASE_DETAIL_ACTION.READ);
    }, [setReleaseAction]);

    // Đồng bộ dữ liệu phát hành vào store formValues
    useEffect(() => {
        if (releaseData?.id) {
            setFormValues(releaseData);
        }
    }, [releaseData, setFormValues]);

    const { dataFilter, onChangeFilter, onChangePage } =
        useFilter<ReleaseDspDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE_EXTRA_LARGE,
            status: releaseDspStatus,
            orderBy: ORDER.ASC,
            fieldOrder: RELEASE_DSP_TABLE_KEY.DSP_NAME,
        });

    const { releaseDsp, isLoading: isLoadingReleaseDsp } = useGetListReleaseDsp(
        releaseData?.id ?? '',
        dataFilter
    );

    const onChangeSort = (pagination: any, filters: any, sort: any) => {
        const orderBy = setSortOrder(sort, ORDER.ASC);
        const fieldOrder = sort.field;
        onChangeFilter(
            {
                orderBy,
                fieldOrder,
            },
            false
        );
    };

    const rowSelection = {
        selectedRowKeys: selectedRow.map((row) => row.dsp?.id),
        onChange: () => {}, // Chặn thay đổi checkbox ở chế độ chỉ xem
        getCheckboxProps: (record: ReleaseDspData) => ({
            disabled: true, // Vô hiệu hóa checkbox
        }),
    };

    useEffect(() => {
        setSelectedRow(
            releaseDsp?.items?.filter((item) => item.isSelected) ?? []
        );
    }, [releaseDsp, setSelectedRow]);

    useEffect(() => {
        setReleaseDspStatus(dataFilter.status as RELEASE_DSP_DELIVERY_STATUS);
    }, [dataFilter.status]);

    return (
        <div className="flex h-full flex-col justify-between pb-4 pt-4">
            <div className="space-y-4">
                <div
                    className="flex justify-between rounded-lg p-2"
                    style={{ backgroundColor: token.colorBgContainer }}
                >
                    <DistributionStatus
                        onChangeStatus={(status) => {
                            setReleaseDspStatus(status);
                            onChangeFilter({ status });
                        }}
                        value={releaseDspStatus}
                    />
                </div>

                <div
                    className="rounded-lg"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                >
                    <DistributionTable
                        // sticky={{ offsetHeader: headerHeight }}
                        options={false}
                        dataSource={releaseDsp?.items}
                        rowSelection={rowSelection}
                        tableAlertOptionRender={false}
                        size="large"
                        rowKey={(record) => record.dsp?.id}
                        pagination={{
                            pageSize: dataFilter?.pageSize || 999,
                            total: releaseDsp?.metadata?.totalItems,
                            current: dataFilter.page || 1,
                        }}
                        loading={isLoadingReleaseDsp}
                        onChange={onChangeSort}
                        dataFilter={dataFilter}
                    />
                </div>
            </div>

            <AppPagination
                className="mt-4 rounded-b-lg"
                style={{ backgroundColor: token.colorBgContainer }}
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={releaseDsp?.metadata?.totalItems}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={PAGE_SIZE_OPTIONS}
            />
        </div>
    );
}
