import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { useRouter } from '@/i18n/routing';
import LabelFormModal from '@/modules/labels/components/modal/label-form';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { releaseSchema } from '@/modules/releases/schemas';
import { ReleasesData } from '@/modules/releases/types';
import { UpdateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ConfigProvider, theme } from 'antd';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import CodesSection from './form-section/codes-section';
import GenreLanguageSection from './form-section/genre-language';
import LegalNoticesSection from './form-section/legal-notices';
import ReleaseArtistSection from './form-section/release-artist';
import ReleaseConfigurationSection from './form-section/release-configuration';

export const releaseDetailSchema = (messages: any) =>
    releaseSchema(messages)
        .pick({
            upc: true,
            primaryGenreId: true,
            subGenreId: true,
            releaseLanguage: true,
            labelId: true,
            catalogId: true,
            title: true,
            version: true,
            releaseArtists: true,
            albumFormatId: true,
            // coverArtThumbnails: true,
            pLineOwner: true,
            pLineYear: true,
            cLineYear: true,
            cLineOwner: true,
            isVariousArtist: true,
        })
        .superRefine((data, ctx) => {
            // Validate releaseArtists chỉ khi isVariousArtist là false
            if (!data.isVariousArtist) {
                if (
                    !Array.isArray(data.releaseArtists) ||
                    data.releaseArtists.length < 1
                ) {
                    ctx.addIssue({
                        path: ['releaseArtists'],
                        code: z.ZodIssueCode.custom,
                        message: messages('validation.input'),
                    });
                } else if (
                    !data.releaseArtists.some(
                        (artist) =>
                            artist.artistRole &&
                            artist.artistRole.name === 'Main Artist'
                    )
                ) {
                    ctx.addIssue({
                        path: ['releaseArtists'],
                        code: z.ZodIssueCode.custom,
                        message: messages(
                            'release.validation.mustHaveMainArtist'
                        ),
                    });
                }
            }
        });

export type ReleaseDetailSchema = z.infer<
    ReturnType<typeof releaseDetailSchema>
>;

export default function ReleaseDetailForm() {
    const messages = useTranslations();

    //hook
    const { updateReleaseDraft } = useUpdateReleaseDraft();
    const { active, deActive, isActive } = useActive();
    const { token } = theme.useToken();

    // zustand store - state
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const [showCreateLabel, setShowCreateLabel] = useState<boolean>(false);
    const { isDark } = useThemeMode();
    const { getReleaseTabRoute, action } = useGetReleaseDetailRoute();

    //route
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'];
    const isCreateReleasePage = params['action'] === 'create';

    // const
    const isReadMode = action !== RELEASE_DETAIL_ACTION.EDIT;
    const customTheme = {
        token: {
            colorBgContainerDisabled: isDark ? '#2a2a2a' : '#fff',
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
        } else {
            if (releaseId && formValues) {
                const initialFormValue: ReleaseDetailSchema = {
                    ...(formValues as ReleaseDetailSchema),
                };
                reset(initialFormValue, {
                    keepErrors: true,
                });
            }
        }
    }, [isCreateReleasePage, releaseId, formValues]);

    useEffect(() => {
        const handleTriggerField = async () => {
            const hash = window.location.hash;
            if (!hash) return;
            // const parts = hash.split('.');
            const field = hash.replace('#', '');
            // if (parts.length >= 2) {
            //     field = parts.slice(1).join('.');
            // }
            const el = document.getElementById(field);
            if (el) {
                el.focus();
                el.scrollIntoView({ block: 'center', behavior: 'smooth' });
            }
            await trigger(field as keyof ReleaseDetailSchema);
        };
        window.addEventListener('hashchange', handleTriggerField);

        handleTriggerField();

        return () => {
            window.removeEventListener('hashchange', handleTriggerField);
        };
    }, [trigger]);

    return (
        <ConfigProvider theme={customTheme}>
            <FormProvider {...formMethods}>
                <form
                    className="py-4"
                    onSubmit={handleSubmit(handleNext, handleFormError)}
                >
                    <div className="flex flex-col gap-6">
                        <ReleaseConfigurationSection
                            debouncedUpdate={debouncedUpdate}
                            setShowCreateLabel={setShowCreateLabel}
                        />

                        <CodesSection debouncedUpdate={debouncedUpdate} />

                        <GenreLanguageSection
                            debouncedUpdate={debouncedUpdate}
                        />

                        <ReleaseArtistSection
                            debouncedUpdate={debouncedUpdate}
                        />

                        <LegalNoticesSection
                            debouncedUpdate={debouncedUpdate}
                        />
                    </div>

                    <div className="flex w-full justify-end">
                        <Button
                            onClick={handleNext}
                            disabled={isReadMode}
                            type="primary"
                            className="my-8"
                            loading={isActive}
                        >
                            {messages('common.continue')}
                        </Button>
                    </div>
                </form>
            </FormProvider>

            {showCreateLabel && (
                <LabelFormModal
                    open={showCreateLabel}
                    onCancel={() => setShowCreateLabel(false)}
                />
            )}
        </ConfigProvider>
    );
}
