import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { OnChangeFilter } from '@/hooks/use-filter';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { Link } from '@/i18n/routing';
import { ReleaseArtist } from '@/modules/release-artist/types';
import {
    getReleaseDetailTabRoute,
    RELEASE_DETAIL_ACTION,
} from '@/modules/releases/helpers/link';
import { Typography } from 'antd';
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
    const setAction = useReleaseActionStore((state) => state.setAction);
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
        <div className="flex min-w-0 items-center gap-3">
            <Link
                href={getReleaseDetailTabRoute(
                    record?.id,
                    RELEASES_TABS.CORE_DETAIL
                )}
                onClick={() => setAction(RELEASE_DETAIL_ACTION.READ)}
            >
                <div className="h-12 w-12 min-w-12 sm:h-14 sm:w-14 sm:min-w-14">
                    <ReleaseCoverImage data={record} />
                </div>
            </Link>
            <div className="min-w-0 flex-1">
                <Link
                    href={getReleaseDetailTabRoute(
                        record?.id,
                        RELEASES_TABS.CORE_DETAIL
                    )}
                    onClick={() => setAction(RELEASE_DETAIL_ACTION.READ)}
                >
                    <div className="max-w-[130px] truncate sm:max-w-80">
                        <CustomTooltip title={title}>
                            <Typography.Text className="cursor-pointer hover:underline" strong>
                                {title}
                            </Typography.Text>
                        </CustomTooltip>
                    </div>
                </Link>
                <CustomTooltip title={displayName}>
                    {isVariousArtist ? (
                        <Typography.Text
                            type="secondary"
                            className="block max-w-[130px] cursor-pointer truncate hover:underline sm:max-w-80"
                            onClick={() =>
                                onChangeFilter({
                                    isVariousArtist: 'true',
                                })
                            }
                        >
                            {messages('common.variousArtists')}
                        </Typography.Text>
                    ) : (
                        <Typography.Text
                            type="secondary"
                            className="block max-w-[130px] truncate sm:max-w-80"
                        >
                            {artistName || ''}
                        </Typography.Text>
                    )}
                </CustomTooltip>
            </div>
        </div>
    );
}

