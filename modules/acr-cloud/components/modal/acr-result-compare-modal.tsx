import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { convertSecondsToTime, formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { TrackData } from '@/modules/releases/types';
import { Collapse, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useGetAcrCloudHistory } from '../../hooks/use-get-acr-cloud-history';
import { ResultScan, TrackScanHistoryData } from '../../types';
import ScanResultPanel from '../collapses/scan-result-pancel';

type Props = Omit<AppModalProps, 'children'> & {};

export default function AcrResultCompareModal({ ...props }: Props) {
    const messages = useTranslations();
    const [leftId, setLeftId] = useState<string>();
    const [rightId, setRightId] = useState<string>();
    const dataEdit = useModalStore<TrackData>((state) => state.dataEdit);
    const { acrCloudResult } = useGetAcrCloudHistory(dataEdit?.id);

    const leftData = acrCloudResult?.find((item) => item.id === leftId);
    const rightData = acrCloudResult?.find((item) => item.id === rightId);

    const options: SelectProps['options'] = acrCloudResult?.map((item) => ({
        label: (
            <span className="font-semibold">
                {formattedDate(item?.createdAt)}
            </span>
        ),
        value: item?.id,
    }));

    const firstResult = acrCloudResult?.[0];
    const lastResult = acrCloudResult?.[acrCloudResult.length - 1];

    return (
        <AppModal
            title={messages('common.compare')}
            width={950}
            footer={false}
            {...props}
        >
            <div className="max-h-[600px] space-y-4 overflow-auto">
                <div className="flex gap-4">
                    <Select
                        placeholder={messages('tracks.acrCloud.compareResult')}
                        options={options}
                        className="flex-1"
                        onChange={(val) => {
                            setLeftId(val);
                        }}
                        defaultValue={firstResult?.id}
                    />
                    <Select
                        placeholder={messages('tracks.acrCloud.compareResult')}
                        options={options}
                        className="flex-1"
                        onChange={(val) => setRightId(val)}
                        defaultValue={lastResult?.id}
                    />
                </div>
                <div className="flex gap-4">
                    <div className="flex-1">
                        {leftData && (
                            <div>
                                <ResultCollapse data={leftData} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        {rightData && (
                            <div>
                                <ResultCollapse data={rightData} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppModal>
    );
}

export const ResultCollapse = ({ data }: { data: TrackScanHistoryData }) => {
    const messages = useTranslations();
    return (
        <Collapse
            defaultActiveKey={data.result?.map((_, idx) => idx)}
            items={data.result?.map((item: ResultScan) => {
                const value = item?.content?.music ?? item?.content?.humming;
                return {
                    label: `${convertSecondsToTime(item.key.startSecond)} - ${convertSecondsToTime(item.key.endSecond)} (${messages('tracks.count')}: ${value?.length ?? 0})`,
                    children: <ScanResultPanel data={item} />,
                };
            })}
        />
    );
};
