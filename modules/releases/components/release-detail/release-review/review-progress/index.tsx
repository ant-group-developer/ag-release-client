import { LabelForm } from '@/components/ui/label/labelForm';
import RegionSelect from '@/components/ui/select/region-select';
import TimezoneSelect from '@/components/ui/select/timezone-select';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function ReviewProgress({}: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);

    // Tính toán số trường đã nhập trong thông tin chính
    const calculateCoreInfoProgress = () => {
        if (!formValues) return { completed: 0, total: 0 };

        const requiredFields = [
            'nameRelease',
            'releaseType',
            'artists',
            'genres',
            'metaDataLanguage',
            'label',
            'upc',
            'catalogId',
            'cLineYear',
            'pLineYear',
            'thumbnail',
        ];

        const completed = requiredFields.filter((field) => {
            const value = formValues[field as keyof typeof formValues];
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return !!value;
        }).length;

        return {
            completed,
            total: requiredFields.length,
        };
    };

    // Tính toán số trường đã nhập trong bài hát
    const calculateTracksProgress = () => {
        if (!formValues?.tracks || formValues.tracks.length === 0) {
            return { completed: 0, total: 0 };
        }

        const requiredTrackFields = [
            'title',
            'source',
            'languageTrack',
            'artists',
            'genres',
            'isSensitiveContent',
            'countryLanguage',
            'countryRecording',
            'metadataLanguage',
            'recordingType',
            'fileName',
        ];

        let totalCompleted = 0;
        const totalFields =
            formValues.tracks.length * requiredTrackFields.length;

        formValues.tracks.forEach((track, idx) => {
            const completedFields = requiredTrackFields.filter((field) => {
                const value = track[field as keyof typeof track];
                if (Array.isArray(value)) {
                    return value.length > 0;
                }
                if (typeof value === 'boolean') {
                    if (value === undefined) {
                        return false;
                    }
                    return true;
                }
                return !!value;
            }).length;
            totalCompleted += completedFields;
        });

        return {
            completed: totalCompleted,
            total: totalFields,
        };
    };

    // Tính toán số trường đã nhập trong lịch phát hành
    const calculateScheduleProgress = () => {
        if (!formValues) return { completed: 0, total: 0 };

        const requiredFields = ['releaseDate', 'timezone', 'territory'];

        const completed = requiredFields.filter((field) => {
            const value = formValues[field as keyof typeof formValues];
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return !!value;
        }).length;

        return {
            completed,
            total: requiredFields.length,
        };
    };

    const calculateDistributionProgress = () => {
        // if (!formValues) return { completed: 0, total: 0 };
        // const totalPlatforms = fakeDspData.length;
        // const selectedPlatform = formValues.platforms?.length || 0;
        // return {
        //     completed: selectedPlatform,
        //     total: totalPlatforms,
        // };
    };

    const coreInfo = calculateCoreInfoProgress();
    const coreInfoPercent =
        coreInfo.total === 0
            ? 0
            : Math.round((coreInfo.completed / coreInfo.total) * 100);

    const tracksInfo = calculateTracksProgress();
    const tracksPercent =
        tracksInfo.total === 0
            ? 0
            : Math.round((tracksInfo.completed / tracksInfo.total) * 100);

    const scheduleInfo = calculateScheduleProgress();
    const schedulePercent =
        scheduleInfo.total === 0
            ? 0
            : Math.round((scheduleInfo.completed / scheduleInfo.total) * 100);

    const distributionInfo = calculateDistributionProgress();
    // const distributionPercent =
    //     distributionInfo.total === 0
    //         ? 0
    //         : Math.round(
    //               (distributionInfo.completed / distributionInfo.total) * 100
    //           );

    // Tính toán tổng phần trăm hoàn thành
    const totalPercent = Math.round(
        (coreInfoPercent + tracksPercent + schedulePercent) / 3
    );

    return (
        <div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <LabelForm
                        htmlFor="releaseDate"
                        required
                        label="Thời gian phát hành"
                    />
                    {/* <DatePicker
                        id="releaseDate"
                        className="w-full"
                        format="DD/MM/YYYY"
                        value={
                            formValues.releaseDate
                                ? dayjs(formValues.releaseDate, 'YYYY-MM-DD')
                                : null
                        }
                        inputReadOnly={true}
                    /> */}
                    <Input
                        value={
                            formValues.releaseDate
                                ? formattedDate(
                                      formValues.releaseDate,
                                      DATE_FORMAT.DATE_ONLY
                                  )
                                : ''
                        }
                        readOnly
                    />
                </div>

                <div>
                    <LabelForm htmlFor="timezone" required label="timezone" />

                    <TimezoneSelect
                        value={formValues?.releaseTimezoneId}
                        id="timezone"
                        className="w-full"
                        placeholder={messages('validation.select')}
                        open={false}
                        style={{ pointerEvents: 'none' }}
                        suffixIcon={false}
                    />
                </div>

                <div>
                    <LabelForm
                        htmlFor="territoryType"
                        required
                        label="Khu vực"
                    />

                    <RegionSelect
                        className="w-full"
                        id="territoryType"
                        // value={formValues?.territoryType}
                        multiple
                        allowClear
                        maxTagCount="responsive"
                        maxTagPlaceholder={(value) => (
                            <CustomTooltip
                                title={value
                                    .map((item: any) => item.label)
                                    .join(', ')}
                            >
                                +{value.length}
                            </CustomTooltip>
                        )}
                        open={false}
                        style={{ pointerEvents: 'none' }}
                        placeholder="Chưa chọn khu vực"
                        suffixIcon={false}
                    />
                </div>
            </div>
        </div>
    );
}
