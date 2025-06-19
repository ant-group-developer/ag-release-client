import { fakeDspData } from '@/modules/dashboard/constants/mockData';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { Progress } from 'antd';

type Props = {};

export default function ReviewProgress({}: Props) {
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
            console.log(`Track ${idx + 1} - artists:`, track.artists);
        });

        formValues.tracks.forEach((track, idx) => {
            const completedFields = requiredTrackFields.filter((field) => {
                const value = track[field as keyof typeof track];
                if (Array.isArray(value)) {
                    if (value.length === 0) {
                        console.log(
                            `Track ${idx + 1} thiếu trường:`,
                            field,
                            value
                        );
                    }
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
        if (!formValues) return { completed: 0, total: 0 };

        const totalPlatforms = fakeDspData.length;

        const selectedPlatform = formValues.platforms?.length || 0;

        return {
            completed: selectedPlatform,
            total: totalPlatforms,
        };
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
    const distributionPercent =
        distributionInfo.total === 0
            ? 0
            : Math.round(
                  (distributionInfo.completed / distributionInfo.total) * 100
              );

    // Tính toán tổng phần trăm hoàn thành
    const totalPercent = Math.round(
        (coreInfoPercent + tracksPercent + schedulePercent) / 3
    );

    return (
        <div>
            <p className="text-lg font-medium">Tiến trình nhập dữ liệu</p>
            <div className="grid grid-cols-12 px-8 py-4">
                <div className="col-span-2">
                    <Progress
                        type="circle"
                        percent={totalPercent}
                        status={totalPercent === 100 ? 'success' : 'active'}
                    />
                </div>
                <div className="col-span-2 flex flex-col justify-center gap-4">
                    <span> Thông tin chính </span>
                    <span>Bài hát</span>
                    <span>Lịch phát hành</span>
                    <span>Nền tảng phân phối </span>
                </div>
                <div className="col-span-4 flex flex-col justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <Progress percent={coreInfoPercent} showInfo={false} />
                        <span>
                            {coreInfo.completed}/{coreInfo.total}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Progress percent={tracksPercent} showInfo={false} />
                        <span>
                            {tracksInfo.completed}/{tracksInfo.total}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Progress percent={schedulePercent} showInfo={false} />
                        <span>
                            {scheduleInfo.completed}/{scheduleInfo.total}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Progress
                            percent={distributionPercent}
                            showInfo={false}
                        />
                        <span>
                            {distributionInfo.completed}/
                            {distributionInfo.total}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
