import { DATE_FORMAT } from '@/enums/common';
import { convertMsToMinSec, formattedDate } from '@/helpers/common';
import { AcrMusicItem, ResultScan } from '@/modules/acr-cloud/types';
import { Collapse, CollapseProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    data: ResultScan;
};

export default function ScanResultPanel({ data }: Props) {
    const messages = useTranslations();
    const value = data?.content?.music ?? data?.content?.humming;

    const childItems: CollapseProps['items'] = value?.map(
        (item: AcrMusicItem, i: number) => ({
            key: `i-${i}`,
            label: `${item?.title ?? '-'}`,
            children: (
                <div>
                    <div>
                        <span>{messages('tracks.name')}: </span>
                        <span className="font-bold">{item?.title}</span>
                    </div>
                    <div>
                        <span>ISRC: </span>
                        <span className="font-bold">
                            {item?.external_ids?.isrc}
                        </span>
                    </div>
                    <div>
                        <span>Label: </span>
                        <span className="font-bold">{item?.label}</span>
                    </div>
                    <div>
                        <span>{messages('artist.label')}: </span>
                        <span className="font-bold">
                            {item?.artists
                                .map((artist) => artist.name)
                                .join(' & ')}
                        </span>
                    </div>
                    <div>
                        <span>Album: </span>
                        <span className="font-bold">{item?.album?.name}</span>
                    </div>
                    <div>
                        <span>{messages('releases.releaseDate')}: </span>
                        <span className="font-bold">
                            {formattedDate(
                                item?.release_date,
                                DATE_FORMAT.DATE_ONLY
                            )}
                        </span>
                    </div>
                    <div>
                        <span>{messages('tracks.rageDuplicate')}: </span>
                        <span className="font-bold">
                            {`${convertMsToMinSec(item?.sample_begin_time_offset_ms)} - ${convertMsToMinSec(item?.sample_end_time_offset_ms)}`}
                        </span>
                    </div>
                    <div>
                        <span>
                            {messages('tracks.rageDuplicateInSongDetected')}
                            :{' '}
                        </span>
                        <span className="font-bold">
                            {`${convertMsToMinSec(item?.db_begin_time_offset_ms)} - ${convertMsToMinSec(item?.db_end_time_offset_ms)}`}
                        </span>
                    </div>
                    <div>
                        <span>{messages('common.accuracy')}: </span>
                        <span className="font-bold">{item?.score}</span>
                    </div>
                </div>
            ),
        })
    );

    return <Collapse items={childItems} />;
}
