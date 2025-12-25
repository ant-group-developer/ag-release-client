import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useHash } from '@/hooks/use-hash';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import {
    releaseDetailSchema,
    ReleaseDetailSchema,
} from '@/modules/releases/schemas';
import { ReleasesData } from '@/modules/releases/types';
import { UpdateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ConfigProvider, theme } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CodesSection from './form-section/codes-section';
import GenreLanguageSection from './form-section/genre-language';
import LegalNoticesSection from './form-section/legal-notices';
import ReleaseArtistSection from './form-section/release-artist';
import ReleaseConfigurationSection from './form-section/release-configuration';

export default function ReleaseDetailForm() {
    //hook
    const messages = useTranslations();
    const { updateReleaseDraft } = useUpdateReleaseDraft();
    const { active, deActive, isActive } = useActive();
    const { token } = theme.useToken();
    const hash = useHash();

    // zustand store - state
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const releaseAction = useReleaseActionStore((s) => s?.action);

    //route
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'];
    const isCreateReleasePage = params['action'] === 'create';

    // const
    const isReadMode = releaseAction !== RELEASE_DETAIL_ACTION.EDIT;
    const customTheme = {
        token: {
            colorTextDisabled: token?.colorText,
        },
    };

    // form
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
        getValues,
        setFocus,
        setError,
    } = formMethods;

    // function
    const handleNext = async () => {
        active();
        const valid = await trigger();
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
                onSuccess: (data: ReleasesData) => {
                    // setFormValues(data);
                },
            };
            updateReleaseDraft(variables);
        }, 500),
        [formValues.id]
    );

    useEffect(() => {
        if (isCreateReleasePage) {
            reset();
        } else if (releaseId && formValues) {
            const initialFormValue: ReleaseDetailSchema = {
                ...(formValues as ReleaseDetailSchema),
            };
            reset(initialFormValue, {
                keepErrors: true,
            });
        }
    }, [isCreateReleasePage, releaseId, formValues]);

    useEffect(() => {
        const handleTriggerField = async () => {
            const hash = window.location.hash;
            if (!hash) return;
            const field = hash.replace('#', '');
            const el = document.getElementById(field);
            if (el) {
                el.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
            await trigger(field as keyof ReleaseDetailSchema);
        };
        handleTriggerField();
    }, [trigger, hash]);

    return (
        <ConfigProvider theme={customTheme}>
            <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(handleNext, handleFormError)}>
                    <div className="flex flex-col gap-6">
                        <ReleaseConfigurationSection
                            isReadMode={isReadMode}
                            debouncedUpdate={debouncedUpdate}
                        />

                        <CodesSection
                            isReadMode={isReadMode}
                            debouncedUpdate={debouncedUpdate}
                        />

                        <GenreLanguageSection
                            isReadMode={isReadMode}
                            debouncedUpdate={debouncedUpdate}
                        />

                        <ReleaseArtistSection
                            isReadMode={isReadMode}
                            debouncedUpdate={debouncedUpdate}
                        />

                        <LegalNoticesSection
                            isReadMode={isReadMode}
                            debouncedUpdate={debouncedUpdate}
                        />
                    </div>

                    <div className="flex w-full justify-end">
                        <Button
                            onClick={handleNext}
                            disabled={isReadMode}
                            type="primary"
                            className="my-4"
                            loading={isActive}
                        >
                            {messages('common.continue')}
                        </Button>
                    </div>
                </form>
            </FormProvider>

            {/* {showCreateLabel && (
                <LabelFormModal
                    open={showCreateLabel}
                    onCancel={() => setShowCreateLabel(false)}
                />
            )} */}
        </ConfigProvider>
    );
}
