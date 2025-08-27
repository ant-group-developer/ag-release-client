import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { convertSecondsToTime, formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useGetAcrCloudHistory } from '@/modules/acr-cloud/hooks/use-get-acr-cloud-history';
import { ResultScan, TrackScanHistoryData } from '@/modules/acr-cloud/types';
import { TrackData } from '@/modules/tracks/types';
import { Button, Collapse, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ScanResultPanel from '../collapses/scan-result-pancel';
import AcrResultCompareModal from './acr-result-compare-modal';

type Props = Omit<AppModalProps, 'children'> & {};

export default function AcrCloudScanResultModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<TrackData>((state) => state.dataEdit);
    const { acrCloudResult, isPending } = useGetAcrCloudHistory(dataEdit?.id);
    const [isOpenCompareModal, setOpenCompareModal] = useState<boolean>(false);

    const renderTitle = () => {
        return (
            <div className="space-x-2">
                <span>{`${messages('common.result')}  ACRCloud`}</span>
                <Button
                    onClick={() => setOpenCompareModal(true)}
                    size="small"
                    type="primary"
                >
                    <span>{messages('common.compare')}</span>
                </Button>
            </div>
        );
    };

    return (
        <AppModal
            open
            title={renderTitle()}
            onCancel={closeModal}
            width={1000}
            footer={null}
            className="!top-12"
            {...props}
        >
            <>
                <Spin spinning={isPending}>
                    <div className="max-h-[700px] min-h-[200px] space-y-2 overflow-auto">
                        {acrCloudResult?.map((item: TrackScanHistoryData) => (
                            <Collapse
                                key={item.id}
                                items={[
                                    {
                                        label: (
                                            <span className="font-semibold">
                                                {formattedDate(item?.createdAt)}
                                            </span>
                                        ),
                                        children: (
                                            <div>
                                                <Collapse
                                                    defaultActiveKey={item?.result?.map(
                                                        (
                                                            _: ResultScan,
                                                            idx: number
                                                        ) => idx
                                                    )}
                                                    items={item?.result?.map(
                                                        (item2: ResultScan) => {
                                                            const value =
                                                                item2?.content
                                                                    ?.music ??
                                                                item2?.content
                                                                    ?.humming;
                                                            return {
                                                                label: `${convertSecondsToTime(item2?.key?.startSecond)} - ${convertSecondsToTime(item2?.key?.endSecond)} (${messages('track.count')}: ${value?.length ?? 0})`,
                                                                children: (
                                                                    <div>
                                                                        <ScanResultPanel
                                                                            data={
                                                                                item2
                                                                            }
                                                                        />
                                                                    </div>
                                                                ),
                                                            };
                                                        }
                                                    )}
                                                />
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        ))}
                    </div>
                </Spin>
                <AcrResultCompareModal
                    open={isOpenCompareModal}
                    onCancel={() => setOpenCompareModal(false)}
                />
            </>
        </AppModal>
    );
}
