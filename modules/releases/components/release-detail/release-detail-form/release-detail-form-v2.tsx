import AppConfirm from '@/components/ui/modal/confirm-modal';
import { APP_ROUTES } from '@/enums/routes';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useHash } from '@/hooks/use-hash';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import {
    RELEASE_ROUTE_ACTION,
    RELEASES_STATUS,
    RELEASES_TABS,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useDeleteRelease } from '@/modules/releases/hooks/use-delete-release';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import {
    releaseDetailSchema,
    ReleaseDetailSchema,
} from '@/modules/releases/schemas';
import { ReleasesData } from '@/modules/releases/types';
import { UpdateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { DeleteVariables, UpdateVariables } from '@/types/api';
import { DeleteOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ConfigProvider, Form, theme } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

// Section dependencies
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import CodesSectionV2 from './form-section/codes-section-v2';
import GenreLanguageSectionV2 from './form-section/genre-language-v2';
import LegalNoticesSectionV2 from './form-section/legal-notices-v2';
import ReleaseArtistSectionV2 from './form-section/release-artist-v2';
import ReleaseConfigurationSectionV2 from './form-section/release-configuration-v2';
import ReleaseContributorsSectionV2 from './form-section/release-contributors-v2';

export default function ReleaseDetailFormV2() {
    // Hooks
    const messages = useTranslations();
    const { active, deActive, isActive } = useActive();
    const { token } = theme.useToken();
    const hash = useHash();
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

    // Zustand store - state
    const formValues = useReleaseFormStore((state) => {
        return state.formValues;
    });
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const releaseAction = useReleaseActionStore((s) => s?.action);
    // const setReleaseAction = useReleaseActionStore((state) => state.setAction);

    // Apis
    const { releaseData } = useGetDetailRelease(formValues?.id as string);
    const { updateReleaseDraft } = useUpdateReleaseDraft();
    const { deleteRelease } = useDeleteRelease();

    // Route
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'];
    const isCreateReleasePage = params['action'] === RELEASE_ROUTE_ACTION.CREATE;

    // Const
    const isReadMode = releaseAction !== RELEASE_DETAIL_ACTION.EDIT;

    // Form
    const formMethods = useForm<ReleaseDetailSchema>({
        resolver: zodResolver(releaseDetailSchema(messages)),
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const {
        control,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
        reset,
        setValue,
        clearErrors,
    } = formMethods;

    // Variables for sections
    const releaseArtist = releaseData?.releaseArtists || [];
    const releaseContributor = releaseData?.releaseContributors || [];

    // Functions
    const handleNext = async () => {
        active();
        const valid = await trigger();
        console.log(errors);
        if (valid) {
            router.push(
                getReleaseTabRoute(
                    formValues.id as string,
                    RELEASES_TABS.TRACKS
                )
            );
        } else {
            deActive();
            showNotification('error', messages('validation.error'));
        }
    };

    const handleFormError = (errors: any) => {};

    const handleDeleteRelease = () => {
        const variables: DeleteVariables<ReleasesData['id']> = {
            id: formValues.id as string,
            onSuccess: () => {
                setIsDeleteConfirmOpen(false);
                router.push(APP_ROUTES.RELEASES);
            },
            onError: () => {
                setIsDeleteConfirmOpen(false);
            },
        };
        deleteRelease(variables);
    };

    const debouncedUpdate = useCallback(
        debounce(async (data: any, fieldName?: string) => {
            if (fieldName) {
                const valid = await trigger(
                    fieldName as keyof ReleaseDetailSchema
                );
                if (!valid) return;
            }
            if (!formValues.id) return;
            const variables: UpdateVariables<
                ReleasesData['id'],
                UpdateReleaseDraftPayload
            > = {
                id: formValues.id ?? '',
                payload: data,
                onSuccess: (responseData: ReleasesData) => {
                    setFormValues(responseData);
                    // not reset the entire form
                    Object.keys(data).forEach((key) => {
                        const value = (responseData as any)[key];
                        if (value !== undefined) {
                            setValue(key as keyof ReleaseDetailSchema, value);
                        }
                    });
                },
            };
            updateReleaseDraft(variables);
        }, 500),
        [formValues.id, trigger, updateReleaseDraft, setValue]
    );

    useEffect(() => {
        if (isCreateReleasePage) {
            reset();
        } else if (releaseId && formValues) {
            const initialFormValue: ReleaseDetailSchema = {
                ...(formValues as ReleaseDetailSchema),
            };
            reset(initialFormValue);
        }
    }, [isCreateReleasePage, releaseId, releaseData?.id]);

    useEffect(() => {
        const handleTriggerField = async () => {
            const hashValue = window.location.hash;
            if (!hashValue) return;
            const field = hashValue.replace('#', '');
            const el = document.getElementById(field);
            if (el) {
                el.scrollIntoView({ block: 'center', behavior: 'smooth' });
                el.focus();
            }
            clearErrors();
            await trigger(field as keyof ReleaseDetailSchema);
        };
        handleTriggerField();
        window.addEventListener('hashchange', handleTriggerField);
        return () => {
            window.removeEventListener('hashchange', handleTriggerField);
        };
    }, [trigger, hash, clearErrors]);

    return (
        <FormProvider {...formMethods}>
            <ConfigProvider
                theme={{
                    token: {
                        colorTextDisabled: token.colorText,
                    },
                }}
            >
                <Form
                    className="form-read-only-primary"
                    layout="horizontal"
                    onFinish={handleSubmit(handleNext, handleFormError)}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    labelAlign="left"
                    variant={
                        isReadMode && !isCreateReleasePage
                            ? 'underlined'
                            : 'outlined'
                    }
                >
                    {/* Single white container for all sections */}
                    <div
                        className="flex flex-col gap-12 rounded-lg p-6 shadow-sm"
                        style={{ backgroundColor: token.colorBgContainer }}
                    >
                        <ReleaseConfigurationSectionV2
                            debouncedUpdate={debouncedUpdate}
                            isReadMode={isReadMode}
                            isCreateReleasePage={isCreateReleasePage}
                        />

                        <CodesSectionV2
                            debouncedUpdate={debouncedUpdate}
                            isReadMode={isReadMode}
                            isCreateReleasePage={isCreateReleasePage}
                        />

                        <GenreLanguageSectionV2
                            debouncedUpdate={debouncedUpdate}
                            isReadMode={isReadMode}
                            isCreateReleasePage={isCreateReleasePage}
                        />

                        <LegalNoticesSectionV2
                            debouncedUpdate={debouncedUpdate}
                            isReadMode={isReadMode}
                            isCreateReleasePage={isCreateReleasePage}
                        />
                    </div>

                    <div
                        className="mt-6 rounded-lg p-6 shadow-sm"
                        style={{ backgroundColor: token.colorBgContainer }}
                    >
                        <ReleaseArtistSectionV2
                            debouncedUpdate={debouncedUpdate}
                            isReadMode={isReadMode}
                            isCreateReleasePage={isCreateReleasePage}
                            releaseArtist={releaseArtist}
                        />
                    </div>

                    <div
                        className="mt-6 rounded-lg p-6 shadow-sm"
                        style={{ backgroundColor: token.colorBgContainer }}
                    >
                        <ReleaseContributorsSectionV2
                            isReadMode={isReadMode}
                            isCreateReleasePage={isCreateReleasePage}
                            releaseContributor={releaseContributor}
                        />
                    </div>
                </Form>

                <div className="my-4">
                    {!isCreateReleasePage &&
                        releaseData?.status == RELEASES_STATUS.DRAFT && (
                            <Button
                                danger
                                disabled={isReadMode}
                                shape="round"
                                loading={isActive}
                                icon={<DeleteOutlined />}
                                onClick={() => setIsDeleteConfirmOpen(true)}
                            >
                                {messages('common.delete')}
                            </Button>
                        )}
                </div>

                <AppConfirm
                    open={isDeleteConfirmOpen}
                    modalTitle={`${messages('common.delete')} ${messages('release.label').toLowerCase()}`}
                    paragraph={messages('action.delete.alert', {
                        label: formValues?.title ?? '',
                    })}
                    onCancel={() => setIsDeleteConfirmOpen(false)}
                    onOk={handleDeleteRelease}
                />
            </ConfigProvider>
        </FormProvider>
    );
}
