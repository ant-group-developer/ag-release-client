import AppModal from '@/components/ui/modal/normal-modal';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { Empty, Segmented, Spin, Tabs, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useGetEtlJobStatusDetail } from '../../hooks/use-get-etl-job-status-detail';
import { PeriodStatusDetail } from './period-status-detail';

interface EtlJobStatusDetailModalProps {
    open: boolean;
    onClose: () => void;
    jobId: string | null;
}

export const EtlJobStatusDetailModal: React.FC<
    EtlJobStatusDetailModalProps
> = ({ open, onClose, jobId }) => {
    const messages = useTranslations();
    const { statusDetail, isLoading } = useGetEtlJobStatusDetail(
        jobId as string,
        {
            enabled: open && !!jobId,
        }
    );

    const [activePeriod, setActivePeriod] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>('sales');

    const periods = statusDetail
        ? Object.keys(statusDetail).sort((a, b) => b.localeCompare(a))
        : [];

    useEffect(() => {
        if (periods.length > 0) {
            const firstPeriod = periods[0];
            setActivePeriod(firstPeriod);
            const availableTypes = statusDetail
                ? Object.keys(statusDetail[firstPeriod] || {})
                : [];
            if (availableTypes.length > 0) {
                setSelectedType(availableTypes[0]);
            }
        } else {
            setActivePeriod(null);
        }
    }, [statusDetail]);

    const handlePeriodChange = (key: string) => {
        setActivePeriod(key);
        const availableTypes = statusDetail
            ? Object.keys(statusDetail[key] || {})
            : [];
        if (
            availableTypes.length > 0 &&
            !availableTypes.includes(selectedType)
        ) {
            setSelectedType(availableTypes[0]);
        }
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div
                    style={{
                        display: 'flex',
                        height: 240,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Spin size="small" />
                </div>
            );
        }

        if (!statusDetail || Object.keys(statusDetail).length === 0) {
            return (
                <div style={{ padding: '40px 0' }}>
                    <Empty description={messages('common.noDataAvailable')} />
                </div>
            );
        }

        const tabItems = periods.map((period) => {
            const formattedPeriod = formattedDate(
                period,
                DATE_FORMAT.MONTH_YEAR
            );
            return {
                key: period,
                label: formattedPeriod,
                children: (
                    <PeriodStatusDetail
                        periodData={statusDetail ? statusDetail[period] : {}}
                        selectedType={selectedType}
                    />
                ),
            };
        });

        return (
            <Tabs
                activeKey={activePeriod || undefined}
                onChange={handlePeriodChange}
                items={tabItems}
                tabPosition="left"
                style={{ minHeight: 300 }}
            />
        );
    };

    return (
        <AppModal
            centered
            title={
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingRight: 48,
                    }}
                >
                    <Typography.Title level={5} style={{ margin: 0 }}>
                        {messages(
                            'reportConfigs.importResult.statusDetailModalTitle'
                        )}
                    </Typography.Title>
                    {activePeriod &&
                        statusDetail &&
                        statusDetail[activePeriod] && (
                            <Segmented
                                style={{ fontWeight: 'normal' }}
                                value={selectedType}
                                onChange={(value) =>
                                    setSelectedType(value as string)
                                }
                                options={Object.keys(
                                    statusDetail[activePeriod]
                                ).map((type) => ({
                                    label:
                                        type === 'sales'
                                            ? messages(
                                                  'reportConfigs.reportTypeSales'
                                              )
                                            : type === 'trends'
                                              ? messages(
                                                    'reportConfigs.reportTypeTrends'
                                                )
                                              : type.charAt(0).toUpperCase() +
                                                type.slice(1),
                                    value: type,
                                }))}
                            />
                        )}
                </div>
            }
            open={open}
            onCancel={onClose}
            width={'90vw'}
            height={'90vh'}
            footer={false}
        >
            <div style={{ padding: '12px 0' }}>{renderContent()}</div>
        </AppModal>
    );
};
