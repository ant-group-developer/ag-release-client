import { DATE_FORMAT } from '@/enums/common';
import { cn, formattedDate } from '@/helpers/common';
import { ReleasesData } from '@/modules/releases/types';
import {
    BarcodeOutlined,
    CalendarOutlined,
    CustomerServiceOutlined,
    TagOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { DescriptionsProps } from 'antd';
import { Descriptions } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    releaseData: ReleasesData;
};

export default function ReleaseInfoView({ releaseData }: Props) {
    const messages = useTranslations();

    if (!releaseData) return null;

    const isVariousArtist = !!releaseData.isVariousArtist;
    const artistName = releaseData.releaseArtists
        ?.map((item) => item?.artist?.name)
        .join(' & ');

    const renderArtistName = () => {
        let content = '';
        if (isVariousArtist) {
            content = messages('artist.variousArtists');
        } else if (artistName) {
            content = artistName;
        }

        if (!content) return '';

        return (
            <span className="inline-block text-wrap align-top leading-normal">
                {content}
            </span>
        );
    };

    const items: DescriptionsProps['items'] = [
        {
            key: 'name',
            label: (
                <span className="flex items-center gap-1">
                    <CustomerServiceOutlined />
                    {messages('release.name')}
                </span>
            ),
            children: (
                <span className="inline-block max-w-[500px] text-wrap align-top">
                    {releaseData.title}{' '}
                    {releaseData.version &&
                        releaseData.title &&
                        `[${releaseData.version}]`}
                </span>
            ),
        },
        {
            key: 'type',
            label: (
                <span className="flex items-center gap-1">
                    <TagOutlined />
                    {messages('release.type')}
                </span>
            ),
            children: releaseData.albumFormat?.name,
        },
        ...(releaseData.labelId
            ? [
                  {
                      key: 'label',
                      label: (
                          <span className="flex items-center gap-1">
                              <TagOutlined />
                              Label
                          </span>
                      ),
                      children: releaseData.label?.name,
                  },
              ]
            : []),
        {
            key: 'artist',
            label: (
                <span className="flex items-center gap-1">
                    <UserOutlined />
                    {messages('artist.label')}
                </span>
            ),
            children: renderArtistName(),
        },
        {
            key: 'releaseDate',
            label: (
                <span className="flex items-center gap-1">
                    <CalendarOutlined />
                    {messages('common.releaseDate')}
                </span>
            ),
            children: releaseData.releaseDate
                ? formattedDate(releaseData.releaseDate, DATE_FORMAT.DATE_ONLY)
                : '-',
        },
        ...(releaseData.upc
            ? [
                  {
                      key: 'upc',
                      label: (
                          <span className="flex items-center gap-1">
                              <BarcodeOutlined />
                              UPC
                          </span>
                      ),
                      children: releaseData.upc,
                  },
              ]
            : []),
    ];

    return (
        <div className="overflow-hidden max-h-40">
            <Descriptions
                layout="horizontal"
                size="small"
                column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 3 }}
                colon={false}
                items={items}
                className="[&_.ant-descriptions-item-label]:min-w-[80px]"
            />
        </div>
    );
}
