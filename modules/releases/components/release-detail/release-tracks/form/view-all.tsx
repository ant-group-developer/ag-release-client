import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useReleaseDetailActionStore } from '@/modules/releases/hooks/use-release-action-store';
import {
    releaseTrackSchema,
    ReleaseTrackSchema,
} from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfigProvider } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import AudioSpecSection from '../collapse/view-all-collapse/audio-spec-section';
import GenreSection from '../collapse/view-all-collapse/genre-section';
import LanguageSection from '../collapse/view-all-collapse/language-section';
import OtherSection from '../collapse/view-all-collapse/other-section';
import TrackAndArtistSection from '../collapse/view-all-collapse/track-and-artist-section';

type Props = {
    trackData: TrackData;
    updateTrackDraft: (data: any) => void;
    index: number;
};

export default function ViewAll({ index, trackData, updateTrackDraft }: Props) {
    const messages = useTranslations();
    const formMethods = useForm<ReleaseTrackSchema>({
        defaultValues: {
            ...trackData,
            pLineYear: trackData?.pLineYear ?? undefined,
        },
        resolver: zodResolver(releaseTrackSchema(messages)),
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    const releaseDetailAction = useReleaseDetailActionStore(
        (state) => state.action
    );
    const isReadMode = releaseDetailAction === RELEASE_DETAIL_ACTION.READ;

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
        reset,
        setValue,
    } = formMethods;

    useEffect(() => {
        const handleTriggerField = () => {
            const hash = window.location.hash;
            if (hash) {
                const parts = hash.split('.');
                let field = parts[2];
                if (parts.length >= 4) {
                    field = parts.slice(2).join('.');
                }
                trigger(field as keyof ReleaseTrackSchema);
            }
        };
        window.addEventListener('hashchange', handleTriggerField);

        handleTriggerField();

        return () => {
            window.removeEventListener('hashchange', handleTriggerField);
        };
    }, []);

    return (
        <ConfigProvider componentDisabled={isReadMode}>
            <FormProvider {...formMethods}>
                <div className="flex flex-col gap-4">
                    <TrackAndArtistSection
                        trackData={trackData}
                        debouncedUpdateTrackDraft={updateTrackDraft}
                        index={index}
                    />
                    <GenreSection
                        index={index}
                        debouncedUpdateTrackDraft={updateTrackDraft}
                        trackData={trackData}
                    />
                    <LanguageSection
                        index={index}
                        debouncedUpdateTrackDraft={updateTrackDraft}
                        trackData={trackData}
                    />
                    <OtherSection
                        index={index}
                        debouncedUpdateTrackDraft={updateTrackDraft}
                        trackData={trackData}
                    />

                    <AudioSpecSection
                        index={index}
                        debouncedUpdateTrackDraft={updateTrackDraft}
                        trackData={trackData}
                    />
                </div>
            </FormProvider>
        </ConfigProvider>
    );
}
