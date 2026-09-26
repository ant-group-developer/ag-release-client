import DateSelect2 from '@/components/ui/select/date-select2';
import { ANALYTICS_RELEASE_TYPE } from '@/modules/analytics2/enums';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Flex, Radio } from 'antd';
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
        <Flex
            wrap
            gap="small"
            align="center"
            className="w-full justify-start sm:w-auto sm:justify-end"
        >
            <Button
                icon={<DownloadOutlined />}
                onClick={onExportClick}
                className="!w-full sm:!w-auto"
            >
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
                className="!flex !w-full sm:!w-auto [&>label]:!inline-flex [&>label]:!flex-1 [&>label]:!items-center [&>label]:!justify-center [&>label]:!text-center sm:[&>label]:!flex-none"
            />
            <DateSelect2
                className="!w-full sm:!w-[240px]"
                value={`${fromDate},${toDate}`}
                onChange={(value) => {
                    const [startDate, endDate] = value.toString().split(',');

                    onDateChange(startDate, endDate);
                }}
                picker="date"
            />
        </Flex>
    );
}
