import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { APP_ROUTES } from '@/enums/routes';
import { UseFilterProps } from '@/hooks/use-filter';
import { useRouter } from '@/i18n/routing';
import { RELEASE_TYPE } from '@/modules/releases/enums';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { ReleasesDataFilter } from '@/modules/releases/types';
import { useTranslations } from 'next-intl';
import nProgress from 'nprogress';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';

type Props = Pick<
    UseFilterProps<ReleasesDataFilter>,
    'dataFilter' | 'onSearch'
>;

export default function ReleaseVideoHeader({ dataFilter, onSearch }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const { createReleaseDraft, isPending } = useCreateReleaseDraft();

    const handleCreateReleaseVideo = () => {
        nProgress.start();
        createReleaseDraft({
            payload: {
                title: 'New release video',
                type: RELEASE_TYPE.VIDEO,
            },
            onSuccess: (data) => {
                nProgress.done();
                if (data?.id) {
                    router.push(`${APP_ROUTES.RELEASE_VIDEOS}/${data.id}`);
                } else {
                    router.push(APP_ROUTES.RELEASE_VIDEOS);
                }
            },
            onError: () => {
                nProgress.done();
            },
        });
    };

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
                    <PermissionGate permission={PERMISSION.RELEASE_VIDEO.CREATE}>
                        <CreateButton
                            canCreate={true}
                            text={messages('releaseVideo.add')}
                            loading={isPending}
                            onClick={handleCreateReleaseVideo}
                        />
                    </PermissionGate>
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
