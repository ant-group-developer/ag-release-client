import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useHash } from '@/hooks/use-hash';
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
            ...(trackData as ReleaseTrackSchema),
        },
        resolver: zodResolver(releaseTrackSchema(messages)),
        mode: 'onChange',
        reValidateMode: 'onChange',
    });
    const { action } = useGetReleaseDetailRoute();
    const isReadMode = action === RELEASE_DETAIL_ACTION.READ;
    const hash = useHash();
    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
        reset,
        setValue,
        setFocus,
    } = formMethods;

    useEffect(() => {
        if (trackData) {
            reset(trackData as ReleaseTrackSchema, { keepErrors: true });
        }
    }, [trackData, reset]);

    useEffect(() => {
        if (!hash) return;
        const newHash = hash.replace('#', '');
        // #tracks.2.trackLanguage.audioLanguageId.trackId -> tracks.2.trackLanguage.audioLanguageId.trackId
        const parts = newHash.split('.');
        // tracks.2.trackLanguage.audioLanguageId.trackId -> tracks.2.trackLanguage.audioLanguageId
        if (parts.length > 3) parts.pop();
        const idField = parts.join('.');
        const fieldNameTrigger = parts.slice(2).join('.');
        console.log('🚀 ~ ViewAll ~ fieldNameTrigger:', fieldNameTrigger);
        // const timer = setTimeout(async () => {
        const el = document.getElementById(idField);
        if (el) {
            el.focus();
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
            trigger(fieldNameTrigger as keyof ReleaseTrackSchema);
        }
        // }, 100);
        // return () => clearTimeout(timer);
    }, [trigger, hash]);

    return (
        <ConfigProvider componentDisabled={isReadMode}>
            <FormProvider {...formMethods}>
                <form className="flex h-[80vh] flex-col gap-4 overflow-y-auto pr-1">
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
                </form>
            </FormProvider>
        </ConfigProvider>
    );
}
