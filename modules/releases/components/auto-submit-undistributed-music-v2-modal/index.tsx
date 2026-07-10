'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import AppPagination from '@/components/ui/pagination';
import AppProTable from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON_SMALL } from '@/constants/common';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { DATE_FORMAT, ORDER } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { useBulkSubmitRelease } from '@/modules/releases/hooks/use-bulk-submit-release';
import { useGetListReleases } from '@/modules/releases/hooks/use-get-list-releases';
import { usePreviewBulkSubmitResult } from '@/modules/releases/hooks/use-preview-bulk-submit-result';
import { EyeOutlined, SettingOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import {
    Alert,
    Button,
    Form,
    message,
    Popover,
    Space,
    TableProps,
    Tag,
    theme,
} from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useMemo, useState } from 'react';
import {
    RELEASE_TYPE,
    RELEASES_COLUMNS_DISPLAY,
    RELEASES_TABLE_KEY,
} from '../../enums';
import { ReleasesData, ReleasesDataFilter } from '../../types';
import ReleasesHeaderV2 from '../header';
import DspDeliveryFilterDropdown from '../table/dsp-delivery-filter-dropdown';
import DspStatusModal from '../table/dsp-status-modal';
import ReleaseTitleColumn from '../table/title-column';
import ReleaseStatusTag from '../tag/release-status-tag';
import SubmitConfigForm, { AutoSubmitV2FormValues } from './config-form';
import PreviewSubmitModal from './preview-modal';

interface AutoSubmitUndistributedMusicV2ModalProps {
    onFinished?: () => void;
}

const DEFAULT_FILTER: ReleasesDataFilter = {
    page: 1,
    pageSize: 10,
    orderBy: ORDER.DESC,
    fieldOrder: RELEASES_COLUMNS_DISPLAY.CREATED_AT,
    type: RELEASE_TYPE.AUDIO,
    isImportedFromReport: 'false',
};

const AutoSubmitUndistributedMusicV2Modal = ({
    onFinished,
}: AutoSubmitUndistributedMusicV2ModalProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm<AutoSubmitV2FormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
    const { token } = theme.useToken();
    const [isDspFilterOpen, setIsDspFilterOpen] = useState(false);
    const [filterState, setFilterState] =
        useState<ReleasesDataFilter>(DEFAULT_FILTER);
    const [selectedReleaseIds, setSelectedReleaseIds] = useState<string[]>([]);
    const [previewRecord, setPreviewRecord] = useState<ReleasesData | null>(
        null
    );
    const [dspStatusRecord, setDspStatusRecord] = useState<ReleasesData | null>(
        null
    );
    const [isDspStatusOpen, setIsDspStatusOpen] = useState(false);
    const [previewData, setPreviewData] = useState<any>(null);

    const { bulkSubmitRelease, isPending: isSubmitting } =
        useBulkSubmitRelease();
    const { previewBulkSubmitResult, isPending: isPreviewing } =
        usePreviewBulkSubmitResult();
    const { releasesData, isFetching: isReleaseDataLoading } =
        useGetListReleases(filterState);
    const { dspData, isFetching: isFetchingDsp } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        isActive: true,
    });
    const { dspData: inactiveDspData } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        isActive: false,
    });

    const dspDataFilter = useMemo(() => {
        return dspData?.items?.filter((item) => !!item.codeCi) || [];
    }, [dspData?.items]);

    const defaultDspCodes = useMemo(
        () => dspDataFilter.map((item) => item.code),
        [dspDataFilter]
    );

    const dspStatusRecordWithInactiveDsps = useMemo(() => {
        if (!dspStatusRecord) return null;

        const currentDeliveries = dspStatusRecord.releaseDspDeliveries ?? [];
        const currentDspKeys = new Set(
            currentDeliveries
                .map((item) => item?.dsp?.id ?? item?.dsp?.code)
                .filter(Boolean)
        );
        const inactiveDeliveries =
            inactiveDspData?.items
                ?.filter(
                    (dsp) =>
                        !currentDspKeys.has(dsp.id) &&
                        !currentDspKeys.has(dsp.code)
                )
                .map((dsp) => ({
                    id: `inactive-${dsp.id}`,
                    dsp,
                    status: undefined,
                    isSelected: false,
                    lastEnqueuedAt: null,
                    lastDeliveredAt: null,
                    isActive: false,
                    hasLiveVersion: false,
                })) ?? [];

        return {
            ...dspStatusRecord,
            releaseDspDeliveries: [...currentDeliveries, ...inactiveDeliveries],
        } as ReleasesData;
    }, [dspStatusRecord, inactiveDspData?.items]);

    useEffect(() => {
        if (dspDataFilter.length > 0) {
            form.setFieldsValue({
                dspCodes: defaultDspCodes,
                needImportAgain: false,
                skipDistributed: true,
            });
        }
    }, [defaultDspCodes, dspDataFilter.length, form]);

    const onChangeFilter = (
        newValue: Partial<ReleasesDataFilter>,
        backToFirstPage = true
    ) => {
        setFilterState((prev) => {
            const next = { ...prev, ...newValue };
            if (backToFirstPage) {
                next.page = 1;
            }
            return next;
        });
    };

    const onChangePage = (page: number, pageSize: number) => {
        setFilterState((prev) => ({
            ...prev,
            page,
            pageSize,
        }));
    };

    const removeFilter = () => {
        setFilterState(DEFAULT_FILTER);
    };

    const canClearFilter =
        JSON.stringify(filterState) !== JSON.stringify(DEFAULT_FILTER);

    const buildPayload = async (ids: string[]) => {
        const values = form.getFieldsValue(true);
        const codes =
            Array.isArray(values.dspCodes) && values.dspCodes.length > 0
                ? values.dspCodes
                : defaultDspCodes;

        if (codes.length === 0) {
            message.error('Vui lòng chọn DSP');
            return null;
        }

        return {
            ids,
            codes,
            status: RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED,
            needImportAgain: values.needImportAgain ?? false,
            skipDistributed: values.skipDistributed ?? true,
        };
    };

    const handleSubmit = async () => {
        if (selectedReleaseIds.length === 0) return;

        const payload = await buildPayload(selectedReleaseIds);
        if (!payload) return;

        bulkSubmitRelease({
            payload,
            onSuccess: () => {
                closeModal();
                onFinished?.();
            },
        });
    };

    const handlePreview = async (record: ReleasesData) => {
        const payload = await buildPayload([record.id]);
        if (!payload) return;

        setPreviewRecord(record);
        previewBulkSubmitResult({
            payload,
            onSuccess: (data) => {
                setPreviewData(data);
            },
        });
    };

    const columns: ProColumns<ReleasesData>[] = [
        {
            title: messages('common.title'),
            key: 'title',
            dataIndex: RELEASES_TABLE_KEY.TITLE,
            ellipsis: true,
            align: 'left',
            width: 300,
            fixed: 'left',
            render: (_, record) => (
                <ReleaseTitleColumn
                    record={record}
                    onChangeFilter={onChangeFilter}
                />
            ),
        },
        {
            title: messages('label.label'),
            key: 'publisher',
            dataIndex: RELEASES_TABLE_KEY.PUBLISHER,
            align: 'left',
            width: 180,
            ellipsis: true,
            render: (_, record) => (
                <CustomTooltip
                    title={messages('filter.filterByValue', {
                        value: record?.label?.name,
                    })}
                >
                    <span
                        data-stop-row-click="true"
                        onClick={() =>
                            onChangeFilter({
                                labelId: record?.labelId,
                            })
                        }
                        className="cursor-pointer truncate hover:underline"
                    >
                        {record?.label?.name}
                    </span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('release.type'),
            key: 'type',
            dataIndex: RELEASES_TABLE_KEY.TYPE,
            align: 'left',
            width: 120,
            render: (_, record) => (
                <Tag className="cursor-pointer truncate">
                    {record?.albumFormat?.name}
                </Tag>
            ),
        },
        {
            title: messages('formFields.upc'),
            key: 'upc',
            dataIndex: RELEASES_TABLE_KEY.UPC,
            align: 'left',
            width: 140,
            render: (_, record) => (
                <Paragraph
                    data-stop-row-click="true"
                    className="!mb-0"
                    copyable={!!record?.upc}
                >
                    {record?.upc}
                </Paragraph>
            ),
        },
        {
            title: messages('common.status'),
            key: 'status',
            dataIndex: RELEASES_TABLE_KEY.STATUS,
            align: 'left',
            width: 130,
            render: (_, record) => <ReleaseStatusTag status={record?.status} />,
        },
        {
            title: messages('release.dspLive'),
            key: 'dsps_live',
            dataIndex: 'dsps_live',
            align: 'left',
            width: 120,
            filterDropdownOpen: isDspFilterOpen,
            onFilterDropdownOpenChange: setIsDspFilterOpen,
            filterIcon: () => (
                <Filter
                    size={SIZE_ICON_SMALL}
                    style={{
                        color: filterState.dspDelivery ? token.colorPrimary : undefined,
                    }}
                />
            ),
            filterDropdown: () => (
                <DspDeliveryFilterDropdown
                    dataFilter={filterState}
                    onChangeFilter={onChangeFilter}
                    onClose={() => setIsDspFilterOpen(false)}
                />
            ),
            render: (_, record) => {
                const releaseDspDeliveries = record?.releaseDspDeliveries ?? [];
                const liveCount = releaseDspDeliveries.filter(
                    (item) =>
                        item.status === RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
                ).length;
                const totalCount = releaseDspDeliveries.length;

                return (
                    <div data-stop-row-click="true">
                        <span
                            className="cursor-pointer hover:text-blue-500"
                            onClick={() => {
                                setDspStatusRecord(record);
                                setIsDspStatusOpen(true);
                            }}
                        >
                            {`${liveCount}/${totalCount}`}
                        </span>
                    </div>
                );
            },
        },
        {
            title: messages('release.releaseDate'),
            key: 'releaseDate',
            dataIndex: RELEASES_TABLE_KEY.RELEASE_DATE,
            align: 'left',
            width: 140,
            render: (_, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(
                        record?.releaseDate,
                        DATE_FORMAT.DATE_MINUTE
                    )}
                </span>
            ),
        },
        {
            title: messages('common.action'),
            key: 'preview',
            align: 'center',
            width: 130,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    data-stop-row-click="true"
                    size="small"
                    icon={<EyeOutlined />}
                    loading={isPreviewing && previewRecord?.id === record.id}
                    onClick={(event) => {
                        event.stopPropagation();
                        handlePreview(record);
                    }}
                >
                    {messages('release.autoSubmitV2.previewData')}
                </Button>
            ),
        },
    ];

    const rowSelection: TableProps<ReleasesData>['rowSelection'] = {
        selectedRowKeys: selectedReleaseIds,
        preserveSelectedRowKeys: true,
        onChange: (selectedRowKeys: Key[]) => {
            setSelectedReleaseIds(selectedRowKeys as string[]);
        },
    };

    return (
        <AppModal
            open
            onCancel={closeModal}
            width="90vw"
            styles={{
                body: {
                    maxHeight: '85vh',
                    overflowY: 'auto',
                },
            }}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    {messages('common.cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmitting}
                    disabled={selectedReleaseIds.length === 0}
                    onClick={handleSubmit}
                >
                    {messages('common.submit')}
                </Button>,
            ]}
            centered
        >
            <div className="flex flex-col gap-4">
                <div>
                    <div className="mb-3 flex items-center justify-between pr-6">
                        <span className="text-base font-semibold">
                            {messages('release.autoSubmitV2.title')}
                        </span>
                        <Space>
                            {selectedReleaseIds.length > 0 && (
                                <Alert
                                    type="info"
                                    showIcon
                                    message={messages(
                                        'release.autoSubmitV2.selectedCount',
                                        {
                                            count: selectedReleaseIds.length,
                                        }
                                    )}
                                    style={{ padding: '4px 12px' }}
                                />
                            )}
                            <Popover
                                trigger="click"
                                placement="bottomRight"
                                title={messages(
                                    'release.autoSubmitV2.submitConfig'
                                )}
                                content={
                                    <SubmitConfigForm
                                        form={form}
                                        dspDataFilter={dspDataFilter}
                                        isFetchingDsp={isFetchingDsp}
                                        defaultDspCodes={defaultDspCodes}
                                    />
                                }
                            >
                                <Button icon={<SettingOutlined />}>
                                    {messages('release.autoSubmitV2.config')}
                                </Button>
                            </Popover>
                        </Space>
                    </div>

                    <div className="mb-3">
                        <ReleasesHeaderV2
                            dataFilter={filterState}
                            onChangeFilter={onChangeFilter}
                            canClearFilter={canClearFilter}
                            removeFilter={removeFilter}
                        />
                    </div>

                    <AppProTable
                        dataSource={releasesData?.items}
                        loading={isReleaseDataLoading}
                        columns={columns}
                        rowSelection={rowSelection}
                        pagination={false}
                        search={false}
                        options={false}
                        tableAlertRender={false}
                        tableAlertOptionRender={false}
                        size="small"
                        scroll={{ x: 1220, y: 460 }}
                        onRow={(record) => ({
                            onClick: (event) => {
                                const target = event.target as HTMLElement;
                                if (
                                    target.closest(
                                        '[data-stop-row-click="true"]'
                                    )
                                ) {
                                    return;
                                }

                                const key = record.id;
                                setSelectedReleaseIds((prev) =>
                                    prev.includes(key)
                                        ? prev.filter((id) => id !== key)
                                        : [...prev, key]
                                );
                            },
                        })}
                    />

                    <AppPagination
                        current={releasesData?.metadata?.page}
                        pageSize={filterState.pageSize}
                        total={releasesData?.metadata?.totalItems}
                        onChange={onChangePage}
                        showTotalText
                        showSizeChanger
                        showQuickJumper
                    />
                </div>
            </div>

            <PreviewSubmitModal
                previewRecord={previewRecord}
                previewData={previewData}
                onCancel={() => {
                    setPreviewRecord(null);
                    setPreviewData(null);
                }}
            />

            <DspStatusModal
                open={isDspStatusOpen}
                record={dspStatusRecordWithInactiveDsps}
                onCancel={() => {
                    setIsDspStatusOpen(false);
                    setDspStatusRecord(null);
                }}
            />
        </AppModal>
    );
};

export default AutoSubmitUndistributedMusicV2Modal;
