import AppForm from '@/components/ui/antd-form/form';
import { APP_ROUTES } from '@/enums/routes';
import { showNotification, toastPromise } from '@/helpers/messages-helper';
import { usePathname, useRouter } from '@/i18n/routing';
import { useGetListSimpleArtistRole } from '@/modules/artist-role/hooks/use-get-list-simple-artist-role';
import { useDistributeRelease } from '@/modules/distribution/hooks/use-distribute';
import AdditionalTab from '@/modules/release-video/components/modal/additional-tab';
import DetailsTab from '@/modules/release-video/components/modal/details-tab';
import DistributionTab from '@/modules/release-video/components/modal/distribution-tab';
import { RELEASE_VIDEO_TABS } from '@/modules/release-video/enums';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { Card, Form, Tabs, TabsProps } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

type Props = {
    dataEdit?: ReleasesData;
};

const DEFAULT_RELEASE_VIDEO_TAB = RELEASE_VIDEO_TABS.DETAILS;

export default function ReleaseVideoForm({ dataEdit }: Props) {
    const messages = useTranslations();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [form] = Form.useForm();
    // const { active, isActive, deActive } = useActive();
    const isUpdateForm = !!dataEdit?.id;
    const tabParam = searchParams.get('tab');
    const activeTab =
        tabParam !== null &&
        Object.values(RELEASE_VIDEO_TABS).includes(
            tabParam as RELEASE_VIDEO_TABS
        )
            ? (tabParam as RELEASE_VIDEO_TABS)
            : DEFAULT_RELEASE_VIDEO_TAB;

    // const { createReleaseDraft } = useCreateReleaseDraft();
    const { updateReleaseDraft, isPending: isUpdatingDraft } = useUpdateReleaseDraft();
    const { distributeRelease, isPending: isDistributingRelease } =
        useDistributeRelease();
    // const { dspData } = useGetListDspSimple();
    const { artistsRolesData } = useGetListSimpleArtistRole();

    const featuredRoleId = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('featured')
    )?.id;
    const composerRoleId = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('composer')
    )?.id;
    const editorRoleId = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('editor')
    )?.id;
    const producerRoleId = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('producer')
    )?.id;
    const directorRoleId = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('director')
    )?.id;

    const handleFieldUpdate = useCallback(
        (payload: Record<string, any>) => {
            if (!isUpdateForm || !dataEdit?.id) return;
            updateReleaseDraft({
                id: dataEdit.id,
                payload,
            });
        },
        [isUpdateForm, dataEdit?.id, updateReleaseDraft]
    );

    const onFinish = async () => {
        if (!dataEdit?.id) return;


        // const vevoDsp = dspData.find((dsp) =>
        //     dsp.name.toLowerCase().includes('vevo')
        // );
        // if (!vevoDsp?.code) {
        //     showNotification('error', 'Vevo DSP not found.');
        //     return;
        // }

        const promise = distributeRelease({
            id: dataEdit.id,
            code: ['VEVO'],
            onSuccess: () => {
                router.push(APP_ROUTES.RELEASE_VIDEOS);
            },
        });
        toastPromise(promise, messages);
    };

    useEffect(() => {
        if (dataEdit) {
            form.setFieldsValue({
                ...dataEdit,
                cLineYear: dataEdit.cLineYear
                    ? dayjs().year(dataEdit.cLineYear)
                    : undefined,
                artistIds:
                    dataEdit.releaseArtists?.map((a) => a.artistId) || [],
                featuredArtistIds:
                    dataEdit.releaseContributors
                        ?.filter((c) => c.artistRole?.id === featuredRoleId)
                        ?.map((c) => c.artistId) || [],
                composers:
                    dataEdit.releaseContributors
                        ?.filter((c) => c.artistRole?.id === composerRoleId)
                        ?.map((c) => c.artistId) || [],
                editors:
                    dataEdit.releaseContributors
                        ?.filter((c) => c.artistRole?.id === editorRoleId)
                        ?.map((c) => c.artistId) || [],
                producers:
                    dataEdit.releaseContributors
                        ?.filter((c) => c.artistRole?.id === producerRoleId)
                        ?.map((c) => c.artistId) || [],
                directors:
                    dataEdit.releaseContributors
                        ?.filter((c) => c.artistRole?.id === directorRoleId)
                        ?.map((c) => c.artistId) || [],
            });
        } else {
            form.resetFields();
        }
    }, [
        dataEdit,
        form,
        featuredRoleId,
        composerRoleId,
        editorRoleId,
        producerRoleId,
        directorRoleId,
    ]);

    const releaseVideoTabs: TabsProps['items'] = [
        {
            key: RELEASE_VIDEO_TABS.DETAILS,
            label: messages('releaseVideo.tabs.details'),
            children: (
                <DetailsTab form={form} onFieldUpdate={handleFieldUpdate} />
            ),
            style: { outline: 'none' },
        },
        {
            key: RELEASE_VIDEO_TABS.ADDITIONAL,
            label: messages('releaseVideo.tabs.additional'),
            children: (
                <AdditionalTab
                    dataEdit={dataEdit}
                    onFieldUpdate={handleFieldUpdate}
                    form={form}
                />
            ),
            style: { outline: 'none' },
        },
        {
            key: RELEASE_VIDEO_TABS.DISTRIBUTION,
            label: messages('releaseVideo.tabs.distribution'),
            children: <DistributionTab form={form} dataEdit={dataEdit} onFieldUpdate={handleFieldUpdate} />,
            style: { outline: 'none' },
        },
    ];

    const onChangeTab = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Card variant="borderless" className="shadow-sm">
            <AppForm
                form={form}
                showSubmit={isUpdateForm}
                submitText={messages('release.action.submit')}
                submitProps={{
                    loading: isDistributingRelease || isUpdatingDraft,
                    title: isUpdatingDraft ? messages('common.processing') : undefined,
                }}
                submitRootClassName="mt-6 border-t pt-4"
                onFinish={onFinish}
                onFinishFailed={() => {
                    showNotification(
                        'error',
                        messages('validation.missingRequiredFields')
                    );
                }}
                layout="vertical"
            >
                <Tabs
                    activeKey={activeTab}
                    items={releaseVideoTabs}
                    onChange={onChangeTab}
                />
            </AppForm>
        </Card>
    );
}
