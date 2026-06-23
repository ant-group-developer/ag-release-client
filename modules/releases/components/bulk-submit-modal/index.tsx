'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { useBulkSubmitRelease } from '@/modules/releases/hooks/use-bulk-submit-release';
import { ProColumns } from '@ant-design/pro-components';
import { Alert, Avatar, Button, Form, Select, Space, Tag } from 'antd';
import Paragraph from 'antd/es/typography/Paragraph';
import { useTranslations } from 'next-intl';
import { Key, useEffect, useMemo, useState } from 'react';

import AppProTable from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import ReleasesHeaderV2 from '../header';
import ReleaseTitleColumn from '../table/title-column';
import ReleaseStatusTag from '../tag/release-status-tag';

import { DATE_FORMAT, ORDER } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import {
    RELEASE_TYPE,
    RELEASES_COLUMNS_DISPLAY,
    RELEASES_TABLE_KEY,
} from '../../enums';
import { useGetListReleases } from '../../hooks/use-get-list-releases';
import { ReleasesData, ReleasesDataFilter } from '../../types';

interface BulkSubmitModalProps {
    onFinished?: () => void;
}

const BulkSubmitModal = ({ onFinished }: BulkSubmitModalProps) => {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<string[]>((state) => state.dataEdit);
    const { bulkSubmitRelease, isPending: isSubmitting } =
        useBulkSubmitRelease();
    // const { token } = theme.useToken();

    const [idsExclude, setIdsExclude] = useState<string[]>([]);
    const [filterState, setFilterState] = useState<ReleasesDataFilter>({
        page: 1,
        pageSize: 3,
        orderBy: ORDER.DESC,
        fieldOrder: RELEASES_COLUMNS_DISPLAY.CREATED_AT,
        type: RELEASE_TYPE.AUDIO,
    });

    const { releasesData, isFetching: isReleaseDataLoading } =
        useGetListReleases(filterState);

    const { dspData, isFetching: isFetchingDsp } = useGetListDsp({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
        isActive: true,
    });

    const dspDataFilter = useMemo(() => {
        return dspData?.items?.filter((item) => !!item.codeCi) || [];
    }, [dspData?.items]);

    const options = useMemo(() => {
        return dspDataFilter?.map((item) => {
            return {
                label: (
                    <Space>
                        <Avatar size={18} src={item?.picture}>
                            {item?.name[0]}
                        </Avatar>
                        <span>{item.name}</span>
                    </Space>
                ),
                value: item.code,
            };
        });
    }, [dspDataFilter]);

    useEffect(() => {
        if (dspDataFilter && dspDataFilter.length > 0) {
            form.setFieldsValue({
                dspIds: dspDataFilter.map((item) => item.code),
            });
        }
    }, [dspDataFilter, form]);

    const onFinish = (values: { dspIds: string[] }) => {
        if (!dataEdit || dataEdit.length === 0) return;

        bulkSubmitRelease({
            payload: {
                ids: dataEdit,
                codes: values.dspIds,
                idsExclude: idsExclude,
            },
            onSuccess: () => {
                closeModal();
                onFinished?.();
            },
        });
    };

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
        setFilterState({
            page: 1,
            pageSize: 4,
            orderBy: ORDER.DESC,
            fieldOrder: RELEASES_COLUMNS_DISPLAY.CREATED_AT,
            type: RELEASE_TYPE.AUDIO,
        });
    };

    const defaultFilter = {
        page: 1,
        pageSize: 4,
        orderBy: ORDER.DESC,
        fieldOrder: RELEASES_COLUMNS_DISPLAY.CREATED_AT,
        type: RELEASE_TYPE.AUDIO,
    };

    const isSameValue =
        filterState.keyword === undefined &&
        filterState.albumFormatId === undefined &&
        filterState.labelId === undefined &&
        filterState.status === undefined &&
        filterState.genres === undefined &&
        filterState.startCreatedAt === undefined &&
        filterState.endCreatedAt === undefined &&
        filterState.startUpdatedAt === undefined &&
        filterState.endUpdatedAt === undefined &&
        filterState.page === 1 &&
        filterState.pageSize === 4;

    const canClearFilter = !isSameValue;

    const columns: ProColumns<ReleasesData>[] = [
        {
            title: messages('common.title'),
            key: 'title',
            dataIndex: RELEASES_TABLE_KEY.TITLE,
            ellipsis: true,
            align: 'left',
            width: 300,
            fixed: 'left',
            render: (value, record) => {
                return (
                    <ReleaseTitleColumn
                        record={record}
                        onChangeFilter={onChangeFilter}
                    />
                );
            },
        },
        {
            title: messages('label.label'),
            key: 'publisher',
            dataIndex: RELEASES_TABLE_KEY.PUBLISHER,
            align: 'left',
            width: 180,
            ellipsis: true,
            render: (value, record) => (
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
            render: (_, record) => {
                return (
                    <Tag className="cursor-pointer truncate">
                        {record?.albumFormat?.name}
                    </Tag>
                );
            },
        },
        {
            title: messages('formFields.upc'),
            key: 'upc',
            dataIndex: RELEASES_TABLE_KEY.UPC,
            align: 'left',
            width: 130,
            render: (value, record) => (
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
            width: 120,
            render: (value, record) => {
                return <ReleaseStatusTag status={record?.status} />;
            },
        },
        {
            title: messages('release.releaseDate'),
            key: 'releaseDate',
            dataIndex: RELEASES_TABLE_KEY.RELEASE_DATE,
            align: 'left',
            width: 130,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(
                        record?.releaseDate,
                        DATE_FORMAT.DATE_MINUTE
                    )}
                </span>
            ),
        },
        {
            title: messages('common.createdAt'),
            dataIndex: RELEASES_TABLE_KEY.CREATED_AT,
            align: 'left',
            width: 130,
            render: (value, record) => (
                <span className="truncate text-wrap">
                    {formattedDate(record?.createdAt, DATE_FORMAT.DATE_MINUTE)}
                </span>
            ),
        },
    ];

    const rowSelection = {
        selectedRowKeys: idsExclude,
        onChange: (selectedRowKeys: Key[]) => {
            setIdsExclude(selectedRowKeys as string[]);
        },
        preserveSelectedRowKeys: true,
    };

    return (
        <AppModal
            open
            title={messages('release.bulkSubmit')}
            onCancel={closeModal}
            width={'80vw'}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    {messages('common.cancel')}
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={isSubmitting}
                    onClick={() => form.submit()}
                >
                    {messages('common.submit')}
                </Button>,
            ]}
            spinning={isFetchingDsp}
        >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <Form form={form} onFinish={onFinish} layout="vertical">
                    <Form.Item
                        name="dspIds"
                        label={messages('placeholder.selectDsp')}
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                        style={{ marginBottom: 0 }}
                    >
                        <Select
                            mode="multiple"
                            placeholder={messages('placeholder.selectDsp')}
                            options={options}
                            loading={isFetchingDsp}
                        />
                    </Form.Item>
                </Form>

                <div className="border-t pt-4">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-base font-semibold">
                            {messages('release.excludeTitle')}
                        </span>
                        {idsExclude.length > 0 && (
                            <Alert
                                message={
                                    <span>
                                        {messages.rich(
                                            'release.excludeAlertMsg',
                                            {
                                                count: idsExclude.length,
                                                b: (chunks) => (
                                                    <strong>{chunks}</strong>
                                                ),
                                            }
                                        )}
                                    </span>
                                }
                                type="warning"
                                showIcon
                                style={{ padding: '4px 12px' }}
                            />
                        )}
                    </div>

                    <div style={{ marginBottom: 16 }}>
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
                        onRow={(record) => ({
                            onClick: (e) => {
                                const key = record.id;
                                setIdsExclude((prev) => {
                                    if (prev.includes(key)) {
                                        return prev.filter((id) => id !== key);
                                    } else {
                                        return [...prev, key];
                                    }
                                });
                            },
                        })}
                    />
                </div>
            </Space>
        </AppModal>
    );
};

export default BulkSubmitModal;
