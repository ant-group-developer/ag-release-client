import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { OnChangeFilter } from '@/hooks/use-filter';
import { Link } from '@/i18n/routing';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { getReleaseDetailTabRoute } from '@/modules/releases/helpers/link';
import { useTranslations } from 'next-intl';
import { RELEASES_TABS } from '../../enums';
import { ReleasesData, ReleasesDataFilter } from '../../types';
import ReleaseCoverImage from '../image/release-cover-image';

type Props = {
    record: ReleasesData;
    onChangeFilter: OnChangeFilter<ReleasesDataFilter>;
};

export default function ReleaseTitleColumn({ record, onChangeFilter }: Props) {
    const messages = useTranslations();
    const releaseArtists = record?.releaseArtists || [];
    const isVariousArtist = record?.isVariousArtist;

    const artistName = releaseArtists
        .map((item: ReleaseArtist) => item?.artist?.name)
        .join(', ');

    const displayName = isVariousArtist
        ? messages('common.variousArtists')
        : artistName;

    const title =
        record?.title + (record?.version ? ` [${record?.version}]` : '');

    return (
        <div className="flex items-center gap-4">
            <Link
                href={getReleaseDetailTabRoute(
                    record?.id,
                    RELEASES_TABS.CORE_DETAIL
                )}
            >
                <div className="h-14 min-w-14">
                    <ReleaseCoverImage data={record} />
                </div>
            </Link>
            <div>
                <Link
                    href={getReleaseDetailTabRoute(
                        record?.id,
                        RELEASES_TABS.CORE_DETAIL
                    )}
                >
                    <div className="!max-w-80 truncate">
                        <CustomTooltip title={title}>
                            <span className="cursor-pointer hover:underline">
                                {title}
                            </span>
                        </CustomTooltip>
                    </div>
                </Link>
                <CustomTooltip title={displayName}>
                    {isVariousArtist ? (
                        <span
                            className="cursor-pointer truncate text-gray-500 hover:underline"
                            onClick={() =>
                                onChangeFilter({
                                    isVariousArtist: 'true',
                                })
                            }
                        >
                            {messages('common.variousArtists')}
                        </span>
                    ) : (
                        <span
                            // onClick={() =>
                            //     onChangeFilter({
                            //         artistId: mainArtist?.artist?.id,
                            //     })
                            // }
                            className="inline-block !max-w-80 cursor-pointer truncate text-gray-500"
                        >
                            {artistName || ''}
                        </span>
                    )}
                </CustomTooltip>
            </div>
        </div>
    );
}
