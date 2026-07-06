'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import AppPagination from '@/components/ui/pagination';
import AppProTable from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { DATE_FORMAT, ORDER } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import ReleaseDspStatusTag from '@/modules/release-dsp/components/release-dsp-status-tag';
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
    Modal,
    Popover,
    Select,
    TableProps,
    Tabs,
    Tag,
} from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useMemo, useState } from 'react';
import {
    CI_IMPORT_ACTION,
    RELEASE_TYPE,
    RELEASES_COLUMNS_DISPLAY,
    RELEASES_TABLE_KEY,
} from '../../enums';
import { ReleasesData, ReleasesDataFilter } from '../../types';
import DspSelectionTable from '../bulk-submit-modal/dsp-selection-table';
import ReleasesHeaderV2 from '../header';
import DspStatusModal from '../table/dsp-status-modal';
import ReleaseTitleColumn from '../table/title-column';
import ReleaseStatusTag from '../tag/release-status-tag';

interface AutoSubmitUndistributedMusicV2ModalProps {
    onFinished?: () => void;
}

interface AutoSubmitV2FormValues {
    dspCodes: string[];
    ciImportAction?: CI_IMPORT_ACTION;
}

const DEFAULT_FILTER: ReleasesDataFilter = {
    page: 1,
    pageSize: 10,
    orderBy: ORDER.DESC,
    fieldOrder: RELEASES_COLUMNS_DISPLAY.CREATED_AT,
    type: RELEASE_TYPE.AUDIO,
    isImportedFromReport: 'false',
};

const getPreviewDataSource = (data: any) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.releaseDspDeliveries))
        return data.releaseDspDeliveries;
    if (Array.isArray(data?.data)) return data.data;
    return data ? [data] : [];
};

const getSubmitData = (data: any) => data?.submitData ?? data?.data?.submitData;

const getPreviewRowKey = (record: any) =>
    record?.id ?? record?.dsp?.id ?? record?.dspCode;

const hasStatusChange = (record: any) =>
    !!record?.targetStatus && record?.status !== record?.targetStatus;

const AutoSubmitUndistributedMusicV2Modal = ({
    onFinished,
}: AutoSubmitUndistributedMusicV2ModalProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm<AutoSubmitV2FormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
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
                ciImportAction: CI_IMPORT_ACTION.SKIP_CI_IMPORT,
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
            ciImportAction:
                values.ciImportAction ?? CI_IMPORT_ACTION.SKIP_CI_IMPORT,
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
                    Preview data
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

    const configContent = (
        <Form form={form} layout="vertical" className="w-[560px]">
            <Tabs
                size="small"
                type="card"
                items={[
                    {
                        key: 'dsps',
                        label: 'DSP',
                        children: (
                            <Form.Item
                                name="dspCodes"
                                label={messages('placeholder.selectDsp')}
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.select'),
                                    },
                                ]}
                                style={{ marginBottom: 0 }}
                            >
                                <DspSelectionTable
                                    dataSource={dspDataFilter}
                                    loading={isFetchingDsp}
                                    scroll={{
                                        x: 'max-content',
                                        y: 220,
                                    }}
                                />
                            </Form.Item>
                        ),
                    },
                    {
                        key: 'options',
                        label: 'Tuy chon',
                        children: (
                            <Form.Item
                                name="ciImportAction"
                                label="Hanh dong import CI"
                                initialValue={CI_IMPORT_ACTION.SKIP_CI_IMPORT}
                                style={{ marginBottom: 0 }}
                            >
                                <Select
                                    optionLabelProp="title"
                                    options={[
                                        {
                                            value: CI_IMPORT_ACTION.KEEP_CURRENT_STATUS,
                                            title: 'Giu trang thai hien tai',
                                            label: (
                                                <div>
                                                    <div className="font-medium">
                                                        Giu trang thai hien tai
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Giu nguyen
                                                        release.ciData.status,
                                                        khong can thiep trang
                                                        thai CI hien tai. Neu
                                                        release dang
                                                        EXISTS_ON_CI thi van la
                                                        EXISTS_ON_CI; neu dang
                                                        NOT_FOUND_ON_CI thi van
                                                        la NOT_FOUND_ON_CI.
                                                    </div>
                                                </div>
                                            ),
                                        },
                                        {
                                            value: CI_IMPORT_ACTION.SKIP_CI_IMPORT,
                                            title: 'Bo qua import CI',
                                            label: (
                                                <div>
                                                    <div className="font-medium">
                                                        Bo qua import CI
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Chi skip import CI khi
                                                        release hien tai da co
                                                        tren CI, tuc
                                                        release.ciData.status =
                                                        EXISTS_ON_CI. Neu
                                                        release dang
                                                        NOT_FOUND_ON_CI thi
                                                        khong ep skip, giu
                                                        nguyen trang thai do de
                                                        he thong van co the chay
                                                        import khi can.
                                                    </div>
                                                </div>
                                            ),
                                        },
                                        {
                                            value: CI_IMPORT_ACTION.FORCE_CI_IMPORT,
                                            title: 'Bat buoc import CI',
                                            label: (
                                                <div>
                                                    <div className="font-medium">
                                                        Bat buoc import CI
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        Ep chay import CI bang
                                                        cach set
                                                        release.ciData.status =
                                                        NOT_FOUND_ON_CI, du
                                                        truoc do release co the
                                                        dang EXISTS_ON_CI. Muc
                                                        tieu la lam he thong coi
                                                        release nhu chua co tren
                                                        CI de luon chay import
                                                        lai.
                                                    </div>
                                                </div>
                                            ),
                                        },
                                    ]}
                                />
                            </Form.Item>
                        ),
                    },
                ]}
            />
        </Form>
    );

    const previewColumns: ProColumns<any>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 60,
            align: 'center',
            fixed: 'left',
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('distribution.digitalServiceProviders'),
            dataIndex: 'dsp.name',
            key: 'dsp.name',
            fixed: 'left',
            width: 260,
            render: (_, record) => {
                const isLocked =
                    record?.isActive === false ||
                    record?.dsp?.isActive === false;

                return (
                    <div className="flex items-center gap-2">
                        {record?.dsp?.picture && (
                            <img
                                src={record.dsp.picture}
                                alt={record?.dsp?.name}
                                className="h-6 w-6 rounded-full object-cover"
                            />
                        )}
                        <span className="font-semibold">
                            {record?.dsp?.name ?? record?.dspCode ?? '-'}
                        </span>
                        {isLocked && (
                            <CustomTooltip title="Nền tảng phát hành này đã bị khoá, không thể phát hành">
                                <Lock size={16} className="text-gray-400" />
                            </CustomTooltip>
                        )}
                    </div>
                );
            },
        },
        {
            title: messages('distribution.hasLiveVersion'),
            key: 'hasLiveVersion',
            dataIndex: 'hasLiveVersion',
            width: 150,
            render: (_, record) => (
                <Tag color={record?.hasLiveVersion ? 'success' : 'default'}>
                    {record?.hasLiveVersion ? 'Live' : 'Not Live'}
                </Tag>
            ),
        },
        {
            title: 'Current status',
            key: 'status',
            dataIndex: 'status',
            width: 180,
            render: (_, record) =>
                record?.status ? (
                    <ReleaseDspStatusTag status={record.status} />
                ) : (
                    '-'
                ),
        },
        {
            title: 'Target status',
            key: 'targetStatus',
            dataIndex: 'targetStatus',
            width: 180,
            render: (_, record) =>
                record?.targetStatus ? (
                    <ReleaseDspStatusTag status={record.targetStatus} />
                ) : (
                    '-'
                ),
        },
    ];

    return (
        <AppModal
            open
            title="Tự động submit2"
            onCancel={closeModal}
            width="90vw"
            styles={{
                body: {
                    height: '82vh',
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
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-base font-semibold">
                            {messages('release.list')}
                        </span>
                        {selectedReleaseIds.length > 0 && (
                            <Alert
                                type="info"
                                showIcon
                                message={`Đã chọn ${selectedReleaseIds.length} phát hành`}
                                style={{ padding: '4px 12px' }}
                            />
                        )}
                        <Popover
                            trigger="click"
                            placement="bottomRight"
                            title="Cau hinh submit"
                            content={configContent}
                        >
                            <Button icon={<SettingOutlined />}>Cau hinh</Button>
                        </Popover>
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
                        scroll={{ x: 1220, y: 560 }}
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

                {false && (
                    <Form form={form} layout="vertical" className="order-1">
                        <Tabs
                            size="small"
                            type="card"
                            items={[
                                {
                                    key: 'dsps',
                                    label: 'DSP',
                                    children: (
                                        <Form.Item
                                            name="dspCodes"
                                            label={messages(
                                                'placeholder.selectDsp'
                                            )}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        messages(
                                                            'validation.select'
                                                        ),
                                                },
                                            ]}
                                            style={{ marginBottom: 0 }}
                                        >
                                            <DspSelectionTable
                                                dataSource={dspDataFilter}
                                                loading={isFetchingDsp}
                                                scroll={{
                                                    x: 'max-content',
                                                    y: 140,
                                                }}
                                            />
                                        </Form.Item>
                                    ),
                                },
                                {
                                    key: 'options',
                                    label: 'Tuỳ chọn',
                                    children: (
                                        <Form.Item
                                            name="ciImportAction"
                                            label="Hành động import CI"
                                            initialValue={
                                                CI_IMPORT_ACTION.SKIP_CI_IMPORT
                                            }
                                        >
                                            <Select
                                                options={[
                                                    {
                                                        value: CI_IMPORT_ACTION.KEEP_CURRENT_STATUS,
                                                        label: 'Giữ trạng thái hiện tại',
                                                    },
                                                    {
                                                        value: CI_IMPORT_ACTION.SKIP_CI_IMPORT,
                                                        label: 'Bỏ qua import CI',
                                                    },
                                                    {
                                                        value: CI_IMPORT_ACTION.FORCE_CI_IMPORT,
                                                        label: 'Bắt buộc import CI',
                                                    },
                                                ]}
                                            />
                                        </Form.Item>
                                    ),
                                },
                            ]}
                        />
                    </Form>
                )}
            </div>

            <Modal
                title={
                    <div className="flex items-center justify-between gap-3 pr-8">
                        <span>
                            {previewRecord
                                ? `Preview data - ${previewRecord.title}`
                                : 'Preview data'}
                        </span>
                        {getSubmitData(previewData) && (
                            <Popover
                                trigger="click"
                                placement="bottomRight"
                                title="Data submit"
                                content={
                                    <pre className="max-h-[60vh] max-w-[520px] overflow-auto rounded bg-gray-50 p-3 text-xs">
                                        {JSON.stringify(
                                            getSubmitData(previewData),
                                            null,
                                            2
                                        )}
                                    </pre>
                                }
                            >
                                <Button size="small">Data submit</Button>
                            </Popover>
                        )}
                    </div>
                }
                open={!!previewRecord && !!previewData}
                onCancel={() => {
                    setPreviewRecord(null);
                    setPreviewData(null);
                }}
                footer={null}
                width="80vw"
                centered
            >
                <AppProTable
                    dataSource={getPreviewDataSource(previewData)}
                    rowKey={getPreviewRowKey}
                    columns={previewColumns}
                    rowClassName={(record: any) =>
                        hasStatusChange(record)
                            ? 'bg-blue-50/60'
                            : 'bg-gray-50 opacity-45'
                    }
                    pagination={false}
                    options={false}
                    search={false}
                    tableAlertRender={false}
                    tableAlertOptionRender={false}
                    scroll={{
                        x: '70vw',
                        y: '60vh',
                    }}
                />
            </Modal>

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
