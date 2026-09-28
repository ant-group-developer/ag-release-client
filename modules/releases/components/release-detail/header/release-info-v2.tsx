import { DATE_FORMAT } from '@/enums/common';
import { cn, formattedDate } from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
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
    isScrolled: boolean;
};

export default function ReleaseInfoV2({ isScrolled }: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { releaseData } = useGetDetailRelease(formValues?.id as string);

    if (!releaseData) return null;

    const isVariousArtist = !!formValues?.isVariousArtist;
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
        <div
            className={cn(
                'hidden overflow-hidden transition-all duration-300 sm:block',
                {
                    'max-h-20': isScrolled,
                    'max-h-40': !isScrolled,
                }
            )}
        >
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
