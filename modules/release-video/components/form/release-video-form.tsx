import AppForm from '@/components/ui/antd-form/form';
import { APP_ROUTES } from '@/enums/routes';
import { useActive } from '@/hooks/use-active';
import { useRouter } from '@/i18n/routing';
import AdditionalTab from '@/modules/release-video/components/modal/additional-tab';
import DetailsTab from '@/modules/release-video/components/modal/details-tab';
import DistributionTab from '@/modules/release-video/components/modal/distribution-tab';
import { RELEASES_TYPE } from '@/modules/releases/enums';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { Button, Card, Form, Tabs, TabsProps } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';

type Props = {
    dataEdit?: ReleasesData;
};

export default function ReleaseVideoForm({ dataEdit }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const [form] = Form.useForm();
    const { active, isActive, deActive } = useActive();
    const isUpdateForm = !!dataEdit?.id;

    const { createReleaseDraft } = useCreateReleaseDraft();
    const { updateReleaseDraft } = useUpdateReleaseDraft();

    const debouncedUpdate = useCallback(
        debounce((changedValues: any) => {
            if (!isUpdateForm || !dataEdit?.id) return;

            const payloadValues = {
                ...changedValues,
            };

            if ('cLineYear' in changedValues) {
                payloadValues.cLineYear = changedValues.cLineYear
                    ? dayjs(changedValues.cLineYear).year()
                    : null;
            }

            updateReleaseDraft({
                id: dataEdit.id,
                payload: payloadValues,
            });
        }, 500),
        [isUpdateForm, dataEdit?.id, updateReleaseDraft]
    );

    const onFinish = async (values: any) => {
        active();

        const payloadValues = {
            ...values,
            cLineYear: values.cLineYear ? dayjs(values.cLineYear).year() : null,
            type: RELEASES_TYPE.VIDEO as RELEASES_TYPE.VIDEO,
        };

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
                    dataEdit.releaseContributors?.map((c) => c.artistId) || [],
            });
        } else {
            form.resetFields();
        }
    }, [dataEdit, form]);

    const releaseVideoTabs: TabsProps['items'] = [
        {
            key: 'details',
            label: messages('releaseVideo.tabs.details'),
            children: <DetailsTab form={form} />,
        },
        {
            key: 'additional',
            label: messages('releaseVideo.tabs.additional'),
            children: <AdditionalTab />,
        },
        {
            key: 'distribution',
            label: messages('releaseVideo.tabs.distribution'),
            children: <DistributionTab form={form} />,
        },
    ];

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
                <Tabs defaultActiveKey="details" items={releaseVideoTabs} />

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
