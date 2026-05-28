import AppForm from '@/components/ui/antd-form/form';
import { useActive } from '@/hooks/use-active';
import { useGetListSimpleLanguage } from '@/modules/languages/hooks/use-get-list-simple-language';
import { Form, Tabs, TabsProps, Card, Button } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCreateReleaseVideo } from '../../hooks/use-create-release-video';
import { useUpdateReleaseVideo } from '../../hooks/use-update-release-video';
import { ReleaseVideoData } from '../../types';
import AdditionalTab from '@/modules/release-video/components/modal/additional-tab';
import DetailsTab from '@/modules/release-video/components/modal/details-tab';
import DistributionTab from '@/modules/release-video/components/modal/distribution-tab';
import { useRouter } from '@/i18n/routing';
import { APP_ROUTES } from '@/enums/routes';

type Props = {
    dataEdit?: ReleaseVideoData;
};

export default function ReleaseVideoForm({ dataEdit }: Props) {
    const messages = useTranslations();
    const router = useRouter();
    const [form] = Form.useForm();
    const { active, isActive, deActive } = useActive();
    const isUpdateForm = !!dataEdit?.id;

    const { createReleaseVideo } = useCreateReleaseVideo();
    const { updateReleaseVideo } = useUpdateReleaseVideo();
    const { languagesData } = useGetListSimpleLanguage();

    const [videoUrl, setVideoUrl] = useState<string>('');
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

    const onFinish = async (values: any) => {
        active();

        // Map the language ID to its name or code if selected via LanguageSelect
        let finalLanguage = values.language;
        if (languagesData && languagesData.length > 0) {
            const foundLang = languagesData.find(
                (lang) => lang.id === values.language
            );
            if (foundLang) {
                finalLanguage = foundLang.name || foundLang.code;
            }
        }

        const payloadValues = {
            ...values,
            language: finalLanguage,
            isExplicit: !!values.isExplicit,
            containsAiContent: !!values.containsAiContent,
            isMadeForKids: !!values.isMadeForKids,
            primaryArtists: values.primaryArtists || [],
            genres: values.genres || [],
            featuredArtists: values.featuredArtists || [],
            keywords: values.keywords || [],
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
            updateReleaseVideo({
                id: dataEdit.id,
                payload: payloadValues,
                onSuccess: handleSuccess,
                onError: handleError,
            });
        } else {
            createReleaseVideo({
                payload: payloadValues,
                onSuccess: handleSuccess,
                onError: handleError,
            });
        }
    };

    useEffect(() => {
        if (dataEdit) {
            let matchedLanguageId = dataEdit.language;
            if (languagesData && languagesData.length > 0) {
                const foundLang = languagesData.find(
                    (lang) =>
                        lang.name === dataEdit.language ||
                        lang.code === dataEdit.language
                );
                if (foundLang) {
                    matchedLanguageId = foundLang.id;
                }
            }

            form.setFieldsValue({
                ...dataEdit,
                language: matchedLanguageId,
            });
        } else {
            form.resetFields();
        }
    }, [dataEdit, languagesData, form]);

    const releaseVideoTabs: TabsProps['items'] = [
        {
            key: 'details',
            label: messages('releaseVideo.tabs.details'),
            children: (
                <DetailsTab
                    form={form}
                    videoUrl={videoUrl}
                    setVideoUrl={setVideoUrl}
                    thumbnailUrl={thumbnailUrl}
                    setThumbnailUrl={setThumbnailUrl}
                />
            ),
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
            >
                <Tabs defaultActiveKey="details" items={releaseVideoTabs} />

                <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                    <Button
                        onClick={() => router.push(APP_ROUTES.RELEASE_VIDEOS)}
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
            </AppForm>
        </Card>
    );
}
