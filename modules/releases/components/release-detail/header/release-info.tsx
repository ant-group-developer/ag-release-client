import { DATE_FORMAT } from '@/enums/common';
import { cn, formattedDate } from '@/helpers/common';
import {
    FEATURING_ARTIST_ROLE,
    MAIN_ARTIST_ROLE,
} from '@/modules/release-artist/constants';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useTranslations } from 'next-intl';

type Props = {
    isScrolled: boolean;
};

export default function ReleaseInfo({ isScrolled }: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { releaseData } = useGetDetailRelease(formValues?.id as string);
    console.log('🚀 ~ ReleaseInfo ~ releaseData:', releaseData);

    const isVariousArtist = !!formValues?.isVariousArtist;
    const mainArtist = formValues?.releaseArtists?.find(
        (releaseArtist: ReleaseArtist) =>
            releaseArtist.artistRole?.code === MAIN_ARTIST_ROLE
    );
    const featuringArtistNames = formValues?.releaseArtists
        ?.map((item: ReleaseArtist) => {
            if (item?.artistRole?.code == FEATURING_ARTIST_ROLE) {
                return item?.artist?.name;
            }
        })
        .filter(Boolean)
        .join(', ');

    const renderArtistName = () => {
        if (isVariousArtist) {
            return messages('artist.variousArtists');
        } else if (mainArtist) {
            return `${mainArtist?.artist?.name} ${featuringArtistNames && featuringArtistNames?.length > 0 ? `(feat. ${featuringArtistNames})` : ''}`;
        }
        return '';
    };
    return (
        <div>
            <div
                className={cn(
                    'flex h-28 flex-col flex-wrap content-start gap-x-8 gap-y-2 text-sm',
                    {
                        'h-16': isScrolled,
                    }
                )}
            >
                <div>
                    <span>{messages('release.name')}: </span>
                    <span className="font-semibold">
                        {releaseData.title}{' '}
                        {releaseData.version &&
                            releaseData.title &&
                            `[${releaseData.version}]`}
                    </span>
                </div>
                <div>
                    <span>{messages('release.type')}: </span>
                    <span className="font-semibold">
                        {releaseData.albumFormat?.name}
                    </span>
                </div>
                {releaseData.labelId && (
                    <div>
                        <span>Label: </span>
                        <span className="font-semibold">
                            {releaseData?.label?.name}
                        </span>
                    </div>
                )}
                <div>
                    <span>{messages('artist.label')}: </span>
                    <span className="font-semibold">{renderArtistName()}</span>
                </div>
                {/* <div >
                                    <span>{messages('common.genres')}: </span>
                                    <span className="font-semibold">
                                        {formValues?.primaryGenre?.name}
                                    </span>
                                </div> */}
                <div>
                    <span>{messages('common.releaseDate')}: </span>
                    <span className="font-semibold">
                        {formattedDate(
                            releaseData.releaseDate,
                            DATE_FORMAT.DATE_ONLY
                        )}
                    </span>
                </div>

                {releaseData.upc && (
                    <div>
                        <span>UPC: </span>
                        <span className="font-semibold">{releaseData.upc}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
