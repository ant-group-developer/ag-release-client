import { ETL_JOB_SOURCE_TYPE } from '@/modules/report-import/enums';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

const IMPORT_SOURCE_TYPE_MESSAGE_KEYS: Record<ETL_JOB_SOURCE_TYPE, string> = {
    [ETL_JOB_SOURCE_TYPE.REPORT_UPLOAD]:
        'reportConfigs.importResult.sourceTypeReportUpload',
    [ETL_JOB_SOURCE_TYPE.FTP_SYNC_PERIOD]:
        'reportConfigs.importResult.sourceTypeFtpSyncPeriod',
    [ETL_JOB_SOURCE_TYPE.FTP_SYNC_ALL]:
        'reportConfigs.importResult.sourceTypeFtpSyncAll',
    [ETL_JOB_SOURCE_TYPE.FTP_RETRY]:
        'reportConfigs.importResult.sourceTypeFtpRetry',
    [ETL_JOB_SOURCE_TYPE.FTP_AUTO_CRON]:
        'reportConfigs.importResult.sourceTypeFtpAutoCron',
    [ETL_JOB_SOURCE_TYPE.ANALYTICS_REPORT_EXPORT]:
        'reportConfigs.importResult.sourceTypeAnalyticsReportExport',
    [ETL_JOB_SOURCE_TYPE.REPORT_RELEASE_DELETE]:
        'reportConfigs.importResult.sourceTypeReportReleaseDelete',
    [ETL_JOB_SOURCE_TYPE.SPOTIFY_R2_SYNC]:
        'reportConfigs.importResult.sourceTypeSpotifyR2Sync',
    [ETL_JOB_SOURCE_TYPE.SPOTIFY_EXPORT_TRIGGER]:
        'reportConfigs.importResult.sourceTypeSpotifyExportTrigger',
};

const IMPORT_SOURCE_TYPE_SELECT_EXCLUDED_VALUES = [
    ETL_JOB_SOURCE_TYPE.ANALYTICS_REPORT_EXPORT,
    ETL_JOB_SOURCE_TYPE.REPORT_RELEASE_DELETE,
    ETL_JOB_SOURCE_TYPE.FTP_SYNC_ALL,
];

type ImportSourceTypeSelectProps = Omit<SelectProps, 'options'>;

export default function ImportSourceTypeSelect({
    ...props
}: ImportSourceTypeSelectProps) {
    const messages = useTranslations();

    const options = Object.values(ETL_JOB_SOURCE_TYPE)
        .filter(
            (value) =>
                !IMPORT_SOURCE_TYPE_SELECT_EXCLUDED_VALUES.includes(value)
        )
        .map((value) => ({
            label: messages(IMPORT_SOURCE_TYPE_MESSAGE_KEYS[value] as any),
            value,
        }));

    return <Select {...props} options={options} />;
}
