import MetadataInfo from '@/modules/release-detail/release-review/metadata-info';
import ReviewProgress from '@/modules/release-detail/release-review/review-progress';
import TracksInfo from '@/modules/release-detail/release-review/tracks-info/page';

export default function Review() {
    return (
        <div className="flex flex-col gap-8 p-4">
            <ReviewProgress />

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfo />
                <TracksInfo />
            </div>
        </div>
    );
}
