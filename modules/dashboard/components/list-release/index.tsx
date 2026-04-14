import SeeMoreButton from '@/components/ui/button/see-more-button';
import FlatList from '@/components/ui/flat-list';
import AppGrid from '@/components/ui/grid/app-grid';
import { APP_ROUTES } from '@/enums/routes';
import { Link } from '@/i18n/routing';
import { ReleasesData } from '@/modules/releases/types';
import { RightOutlined } from '@ant-design/icons';
import { Empty, theme } from 'antd';
import { useTranslations } from 'next-intl';
import CardRelease from '../card/card-release';

type Props = {
    data: ReleasesData[];
};

export default function ListRelease({ data }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const releaseLength = data?.length;

    return (
        <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-lg font-bold">
                    {messages('release.latestReleases')}
                </p>

                {releaseLength >= 7 && (
                    <Link href={APP_ROUTES.RELEASES}>
                        <SeeMoreButton type="link" icon={<RightOutlined />} />
                    </Link>
                )}
            </div>

            <AppGrid className="">
                <FlatList
                    data={data}
                    renderItem={({ item }) => <CardRelease data={item} />}
                    keyExtractor={(item) => item.id.toString()}
                    loading={false}
                    className="contents"
                />
            </AppGrid>

            {releaseLength <= 0 && (
                <Empty
                    className="!mx-0 rounded-lg py-6"
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                />
            )}
        </div>
    );
}
