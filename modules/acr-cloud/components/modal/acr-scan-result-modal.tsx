import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { convertSecondsToTime, formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { useGetAcrCloudHistory } from '@/modules/acr-cloud/hooks/use-get-acr-cloud-history';
import { ResultScan, TrackScanHistoryData } from '@/modules/acr-cloud/types';
import { TrackData } from '@/modules/tracks/types';
import { Collapse, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import ScanResultPanel from '../collapses/scan-result-pancel';

type Props = Omit<AppModalProps, 'children'> & {};

export default function AcrCloudScanResultModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<TrackData>((state) => state.dataEdit);
    const { acrCloudResult, isPending } = useGetAcrCloudHistory(dataEdit?.id);

    return (
        <AppModal
            open
            title={`${messages('common.result')}  ACRCloud`}
            onCancel={closeModal}
            width={750}
            footer={null}
            className="!top-12"
            {...props}
        >
            <Spin spinning={isPending}>
                <div className="max-h-[700px] min-h-[500px] space-y-2 overflow-auto">
                    {acrCloudResult?.map((item: TrackScanHistoryData) => (
                        <Collapse
                            key={item.id}
                            items={[
                                {
                                    label: formattedDate(item?.createdAt),
                                    children: (
                                        <div>
                                            <Collapse
                                                items={item?.result?.map(
                                                    (item2: ResultScan) => {
                                                        return {
                                                            label: `${convertSecondsToTime(item2?.key?.startSecond)} - ${convertSecondsToTime(item2?.key?.endSecond)} (${messages('tracks.count')}: ${item?.result?.length})`,
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
        </AppModal>
    );
}
