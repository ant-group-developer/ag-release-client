import AppForm from '@/components/ui/antd-form/form';
import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { useGetListSimpleLanguage } from '@/modules/languages/hooks/use-get-list-simple-language';
import { Form, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useCreateReleaseVideo } from '../../hooks/use-create-release-video';
import { useUpdateReleaseVideo } from '../../hooks/use-update-release-video';
import { ReleaseVideoData } from '../../types';
import AdditionalTab from './additional-tab';
import DetailsTab from './details-tab';
import DistributionTab from './distribution-tab';

type Props = Omit<AppModalProps, 'children'> & {};

export default function ReleaseVideoFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore(
        (state) => state.dataEdit as ReleaseVideoData
    );
    const { active, isActive, deActive } = useActive();
    const isUpdateForm = !!dataEdit?.id;

    const { createReleaseVideo } = useCreateReleaseVideo();
    const { updateReleaseVideo } = useUpdateReleaseVideo();
    const { languagesData } = useGetListSimpleLanguage();

    const [videoUrl, setVideoUrl] = useState<string>('');
    const [thumbnailUrl, setThumbnailUrl] = useState<string>('');

    function renderTitle() {
        return `${
            isUpdateForm ? messages('common.update') : messages('common.create')
        } ${messages('releaseVideo.title').toLowerCase()}`;
    }

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
            closeModal();
            form.resetFields();
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
            children: <DistributionTab />,
        },
    ];

    return (
        <FullScreenModal
            width="100%"
            {...props}
            title={renderTitle()}
            open
            onCancel={closeModal}
            onOk={form.submit}
            loading={isActive}
            footer={null}
            styles={{
                body: { padding: '0 24px', overflowY: 'auto' },
                content: { padding: 0 },
            }}
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onFinish}
                layout="vertical"
                disabled={isActive}
            >
                <Tabs defaultActiveKey="details" items={releaseVideoTabs} />
            </AppForm>
        </FullScreenModal>
    );
}
