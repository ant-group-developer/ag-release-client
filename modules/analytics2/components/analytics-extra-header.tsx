import DateSelect2 from '@/components/ui/select/date-select2';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Radio, Space } from 'antd';
import { useTranslations } from 'next-intl';

export type AnalyticsExtraHeaderProps = {
    releaseType?: ANALYTICS_RELEASE_TYPE;
    fromDate: string;
    toDate: string;
    onExportClick: () => void;
    onReleaseTypeChange: (type: ANALYTICS_RELEASE_TYPE) => void;
    onDateChange: (startDate: string, endDate: string) => void;
};

export default function AnalyticsExtraHeader({
    releaseType = ANALYTICS_RELEASE_TYPE.ALL,
    fromDate,
    toDate,
    onExportClick,
    onReleaseTypeChange,
    onDateChange,
}: AnalyticsExtraHeaderProps) {
    const messages = useTranslations();

    return (
        <Space>
            <Button icon={<DownloadOutlined />} onClick={onExportClick}>
                {messages('common.exportReport')}
            </Button>
            <Radio.Group
                buttonStyle="solid"
                optionType="button"
                value={releaseType}
                onChange={(event) =>
                    onReleaseTypeChange(
                        event.target.value as ANALYTICS_RELEASE_TYPE
                    )
                }
                options={[
                    {
                        label: messages('common.all'),
                        value: ANALYTICS_RELEASE_TYPE.ALL,
                    },
                    {
                        label: messages('common.audio'),
                        value: ANALYTICS_RELEASE_TYPE.AUDIO,
                    },
                    {
                        label: messages('common.video'),
                        value: ANALYTICS_RELEASE_TYPE.VIDEO,
                    },
                ]}
            />
            <DateSelect2
                style={{ width: 240 }}
                value={`${fromDate},${toDate}`}
                onChange={(value) => {
                    const [startDate, endDate] = value.toString().split(',');

                    onDateChange(startDate, endDate);
                }}
                picker="date"
            />
        </Space>
    );
}
