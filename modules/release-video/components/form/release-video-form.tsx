import AppForm from '@/components/ui/antd-form/form';
import { APP_ROUTES } from '@/enums/routes';
import { useActive } from '@/hooks/use-active';
import { usePathname, useRouter } from '@/i18n/routing';
import { useGetListSimpleArtistRole } from '@/modules/artist-role/hooks/use-get-list-simple-artist-role';
import AdditionalTab from '@/modules/release-video/components/modal/additional-tab';
import DetailsTab from '@/modules/release-video/components/modal/details-tab';
import DistributionTab from '@/modules/release-video/components/modal/distribution-tab';
import { RELEASE_VIDEO_TABS } from '@/modules/release-video/enums';
import { RELEASE_TYPE } from '@/modules/releases/enums';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { Button, Card, Form, Tabs, TabsProps } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
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
    const { active, isActive, deActive } = useActive();
    const isUpdateForm = !!dataEdit?.id;
    const tabParam = searchParams.get('tab');
    const activeTab =
        tabParam !== null &&
        Object.values(RELEASE_VIDEO_TABS).includes(
            tabParam as RELEASE_VIDEO_TABS
        )
            ? (tabParam as RELEASE_VIDEO_TABS)
            : DEFAULT_RELEASE_VIDEO_TAB;

    const { createReleaseDraft } = useCreateReleaseDraft();
    const { updateReleaseDraft } = useUpdateReleaseDraft();
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

    const debouncedUpdate = useCallback(
        debounce((changedValues: any) => {
            if (!isUpdateForm || !dataEdit?.id) return;

            const payloadValues = {
                ...changedValues,
            };

            delete payloadValues.artistIds;
            delete payloadValues.featuredArtistIds;
            delete payloadValues.composers;
            delete payloadValues.editors;
            delete payloadValues.producers;
            delete payloadValues.directors;

            if ('cLineYear' in changedValues) {
                payloadValues.cLineYear = changedValues.cLineYear
                    ? dayjs(changedValues.cLineYear).year()
                    : null;
            }

            // Skip update if title is being cleared (user is typing a new title)
            if ('title' in payloadValues && !payloadValues.title?.trim()) {
                delete payloadValues.title;
            }

            if (Object.keys(payloadValues).length === 0) return;

            updateReleaseDraft({
                id: dataEdit.id,
                payload: payloadValues,
            });
        }, 700),
        [isUpdateForm, dataEdit?.id, updateReleaseDraft]
    );

    const onFinish = async (values: any) => {
        active();

        const payloadValues = {
            ...values,
            cLineYear: values.cLineYear ? dayjs(values.cLineYear).year() : null,
            type: RELEASE_TYPE.VIDEO as RELEASE_TYPE.VIDEO,
        };

        delete payloadValues.artistIds;
        delete payloadValues.featuredArtistIds;
        delete payloadValues.composers;
        delete payloadValues.editors;
        delete payloadValues.producers;
        delete payloadValues.directors;

        const handleSuccess = () => {
            deActive();
            form.resetFields();
            router.push(APP_ROUTES.RELEASE_VIDEOS);
        };

        const handleError = () => {
            deActive();
        };

        if (isUpdateForm) {
            updateReleaseDraft({
                id: dataEdit.id,
                payload: payloadValues,
                onSuccess: handleSuccess,
                onError: handleError,
            });
        } else {
            createReleaseDraft({
                payload: payloadValues,
                onSuccess: handleSuccess,
                onError: handleError,
            });
        }
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
            children: <DetailsTab form={form} />,
        },
        {
            key: RELEASE_VIDEO_TABS.ADDITIONAL,
            label: messages('releaseVideo.tabs.additional'),
            children: <AdditionalTab dataEdit={dataEdit} />,
        },
        {
            key: RELEASE_VIDEO_TABS.DISTRIBUTION,
            label: messages('releaseVideo.tabs.distribution'),
            children: <DistributionTab form={form} />,
        },
    ];

    const onChangeTab = (tab: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('tab', tab);
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <Card bordered={false} className="shadow-sm">
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onFinish}
                layout="vertical"
                disabled={isActive}
                onValuesChange={(changedValues) => {
                    debouncedUpdate(changedValues);
                }}
            >
                <Tabs
                    activeKey={activeTab}
                    items={releaseVideoTabs}
                    onChange={onChangeTab}
                />

                {!isUpdateForm && (
                    <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                        <Button
                            onClick={() =>
                                router.push(APP_ROUTES.RELEASE_VIDEOS)
                            }
                            disabled={isActive}
                        >
                            {messages('common.cancel')}
                        </Button>
                        <Button
                            type="primary"
                            onClick={form.submit}
                            loading={isActive}
                        >
                            {messages('common.save')}
                        </Button>
                    </div>
                )}
            </AppForm>
        </Card>
    );
}
