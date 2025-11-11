import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import {
    getReleaseDetailTabRoute,
    RELEASE_DETAIL_ACTION,
} from '@/helpers/link';
import { OnChangeFilter } from '@/hooks/use-filter';
import { Link } from '@/i18n/routing';
import { MAIN_ARTIST_ROLE } from '@/modules/release-artist/constants';
import { ReleaseArtist } from '@/modules/release-artist/types';
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

    const mainArtist = !isVariousArtist
        ? releaseArtists.find(
              (item: ReleaseArtist) =>
                  item?.artistRole?.code === MAIN_ARTIST_ROLE
          )
        : null;

    const displayName = isVariousArtist
        ? messages('common.variousArtists')
        : mainArtist?.artist?.name || '';
    return (
        <div className="flex items-center gap-4">
            <div className="h-10 min-w-10">
                <ReleaseCoverImage data={record} />
            </div>
            <div>
                <Link
                    href={getReleaseDetailTabRoute(
                        record?.id,
                        RELEASES_TABS.CORE_DETAIL,
                        RELEASE_DETAIL_ACTION.READ
                    )}
                >
                    <div className="!max-w-80 truncate">
                        <CustomTooltip title={record?.title}>
                            <span className="cursor-pointer hover:underline">
                                {record?.title}
                            </span>
                        </CustomTooltip>
                    </div>
                </Link>
                <CustomTooltip
                    title={messages('filter.filterByValue', {
                        value: displayName,
                    })}
                >
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
                            onClick={() =>
                                onChangeFilter({
                                    artistId: mainArtist?.artist?.id,
                                })
                            }
                            className="cursor-pointer truncate text-gray-500 hover:underline"
                        >
                            {mainArtist?.artist?.name || ''}
                        </span>
                    )}
                </CustomTooltip>
            </div>
        </div>
    );
}
