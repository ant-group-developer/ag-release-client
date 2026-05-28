import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { UseFilterProps } from '@/hooks/use-filter';
import { useTranslations } from 'next-intl';
import { ReleaseVideoDataFilter } from '../../types';
import { useRouter } from '@/i18n/routing';
import { APP_ROUTES } from '@/enums/routes';

type Props = Pick<UseFilterProps<ReleaseVideoDataFilter>, 'dataFilter' | 'onSearch'>;

export default function ReleaseVideoHeader({ dataFilter, onSearch }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    return (
        <AppHeader className="app-header p-2">
            <AppHeaderGroup>
                <div>
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                </div>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <CreateButton
                        canCreate={true}
                        text={messages('releaseVideo.add')}
                        onClick={() => router.push(APP_ROUTES.RELEASE_VIDEOS_CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
