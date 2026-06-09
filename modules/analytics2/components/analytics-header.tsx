import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import { DspData } from '@/modules/dsp/types';
import { Select } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    dspData?: DspData[];
    onDateChange?: (fromDate: string, toDate: string) => void;
};

export default function AnalyticsHeader({ dspData, onDateChange }: Props) {
    const messages = useTranslations();

    return (
        <AppHeader>
            <AppHeaderGroup className="flex w-full items-center justify-between py-2">
                <span className="text-2xl font-bold">
                    {messages('common.statistic')}
                </span>
                <div className="flex items-center gap-3">
                    <Select
                        defaultValue="all-platforms"
                        style={{ width: 160 }}
                        options={[
                            {
                                value: 'all-platforms',
                                label: messages(
                                    'analytics2.filters.allPlatforms'
                                ),
                            },
                            ...(dspData?.map((dsp) => ({
                                value: dsp.id,
                                label: dsp.name,
                            })) || []),
                        ]}
                    />
                    <Select
                        defaultValue="all-regions"
                        style={{ width: 160 }}
                        options={[
                            {
                                value: 'all-regions',
                                label: messages(
                                    'analytics2.filters.allRegions'
                                ),
                            },
                            {
                                value: 'vn',
                                label: messages('analytics2.filters.vietnam'),
                            },
                            {
                                value: 'us',
                                label: messages(
                                    'analytics2.filters.unitedStates'
                                ),
                            },
                        ]}
                    />
                    {/* <DateSelect
                        selectClassName="w-[150px]"
                        rangeClassName="w-[250px]"
                        externalOnChange={onDateChange}
                    /> */}
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
