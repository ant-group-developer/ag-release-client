import { useTranslations } from 'next-intl';

export default function DistributionTab() {
    const messages = useTranslations();

    return (
        <div className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-6 pt-4 text-gray-400">
            <p className="mb-1 font-semibold text-gray-600">
                {messages('releaseVideo.distributionTitle')}
            </p>
            <p className="max-w-sm text-center text-xs text-gray-400">
                {messages('releaseVideo.distributionDesc')}
            </p>
        </div>
    );
}
