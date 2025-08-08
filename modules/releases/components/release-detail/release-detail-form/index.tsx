import { THEME } from '@/enums/common';
import {
    getReleaseDetailTabRoute,
    RELEASE_DETAIL_ACTION,
} from '@/helpers/link';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useThemeStore } from '@/hooks/use-theme-store';
import { useRouter } from '@/i18n/routing';
import LabelFormModal from '@/modules/labels/components/modal/label-form';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseDetailActionStore } from '@/modules/releases/hooks/use-release-action-store';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { releaseSchema } from '@/modules/releases/schemas';
import { ReleasesData } from '@/modules/releases/types';
import { UpdateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { getThemeConfig } from '@/theme/theme-config';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
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
                            'releases.validation.mustHaveMainArtist'
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

    // zustand store - state
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const [showCreateLabel, setShowCreateLabel] = useState<boolean>(false);
    const releaseDetailAction = useReleaseDetailActionStore(
        (state) => state.action
    );
    const { theme: currentTheme, primaryColor } = useThemeStore();

    //route
    const router = useRouter();
    const params = useParams();
    const releaseId = params['release-id'];
    const isCreateReleasePage = params['action'] === 'create';

    // const
    const isReadMode = releaseDetailAction !== RELEASE_DETAIL_ACTION.EDIT;
    const themeConfig = getThemeConfig(currentTheme, primaryColor as string);
    const customTheme = {
        token: {
            ...themeConfig.token,
            colorBgContainerDisabled:
                currentTheme == THEME.LIGHT ? '#fff' : '#2a2a2a',
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
    } = formMethods;

    // function
    const handleNext = async () => {
        active();
        const valid = await trigger();
        if (valid) {
            router.push(
                getReleaseDetailTabRoute(
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
                    setFormValues(data);
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
                    primaryGenreId: formValues.primaryGenreId ?? '',
                    subGenreId: formValues.subGenreId ?? '',
                    title: formValues.title ?? '',

                    releaseArtists: formValues.releaseArtists ?? [],
                    pLineOwner: formValues.pLineOwner ?? `${dayjs().year()}`,
                    cLineOwner: formValues.cLineOwner ?? `${dayjs().year()}`,
                    isVariousArtist: formValues.isVariousArtist ?? false,
                    upc: formValues.upc ?? '',
                    labelId: formValues.labelId ?? '',
                    catalogId: formValues.catalogId ?? '',
                    version: formValues.version ?? '',
                    releaseLanguage: {
                        metadataLanguageId:
                            formValues.releaseLanguage?.metadataLanguageId ??
                            '',
                        audioLanguageId:
                            formValues.releaseLanguage?.audioLanguageId ?? '',
                        metadataLanguageCountryId:
                            formValues.releaseLanguage
                                ?.metadataLanguageCountryId ?? '',
                    },
                    albumFormatId: formValues?.albumFormatId ?? '',
                };
                // setFormValues(initialFormValue);
                reset(initialFormValue, {
                    keepErrors: true,
                });
            }
        }
    }, [isCreateReleasePage, releaseId, formValues]);

    useEffect(() => {
        const handleTriggerField = () => {
            const hash = window.location.hash;
            if (!hash) return;
            const parts = hash.split('.');
            let field = hash.replace('#', '');
            if (parts.length >= 2) {
                field = parts.slice(1).join('.');
            }
            trigger(field as keyof ReleaseDetailSchema);
        };
        window.addEventListener('hashchange', handleTriggerField);

        handleTriggerField();

        return () => {
            window.removeEventListener('hashchange', handleTriggerField);
        };
    }, []);

    return (
        <ConfigProvider theme={customTheme}>
            <FormProvider {...formMethods}>
                <form
                    className="px-4 py-4"
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
                            disabled={isCreateReleasePage || isReadMode}
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
