import AppForm from '@/components/ui/antd-form/form';
import { DATE_FORMAT } from '@/enums/common';
import { convertSecondsToHoursMinutes } from '@/helpers/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { TrackData } from '@/modules/tracks/types';
import { Form, theme } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import AudioSpecSection from '../collapse/view-all-collapse/audio-spec-section';
import GenreSection from '../collapse/view-all-collapse/genre-section';
import LanguageSection from '../collapse/view-all-collapse/language-section';
import OtherSection from '../collapse/view-all-collapse/other-section';
import TrackAndArtistSection from '../collapse/view-all-collapse/track-and-artist-section';
import TrackContributorsSection from '../collapse/view-all-collapse/track-contributors-section';

type Props = {
    trackData: TrackData;
    updateTrackDraft: (data: any) => void;
    index: number;
};

export default function ViewAll({ index, trackData, updateTrackDraft }: Props) {
    // const messages = useTranslations();
    const action = useReleaseActionStore((state) => state.action);
    const isReadMode = action === RELEASE_DETAIL_ACTION.READ;
    const [form] = Form.useForm();
    const {
        trackId,
        index: indexTrack,
        focusField,
    } = useModalStore<{
        trackId: TrackData['id'];
        index: number;
        focusField: string;
    }>((state) => state.dataEdit);
    const { token } = theme.useToken();

    useEffect(() => {
        if (trackData?.id) {
            form.setFieldsValue({
                ...trackData,
                trackLanguage: {
                    ...trackData.trackLanguage,
                },
                audioFile: {
                    ...trackData?.audioFile,
                    sampleLength: trackData?.audioFile?.sampleLength
                        ? dayjs(
                              convertSecondsToHoursMinutes(
                                  trackData?.audioFile?.sampleLength
                              ),
                              DATE_FORMAT.HOUR_MINUTE_SECOND
                          )
                        : undefined,
                    preview: trackData?.audioFile?.preview
                        ? dayjs(
                              convertSecondsToHoursMinutes(
                                  trackData?.audioFile?.preview
                              ),
                              DATE_FORMAT.HOUR_MINUTE_SECOND
                          )
                        : undefined,
                    duration: convertSecondsToHoursMinutes(
                        trackData?.audioFile?.duration ?? 0
                    ),
                },
            });
        }
    }, [trackData, form]);

    // focus and scroll into field
    useEffect(() => {
        if (!trackData?.id || !focusField) return;

        // example: focusField = "tracks.15.audioFile.preview"
        const parts = focusField.split('.');
        const idField = focusField;
        const fieldPath = parts.slice(2); // ["audioFile", "preview"]

        const el = document.getElementById(idField);
        if (el) {
            el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }

        form.validateFields([fieldPath]);
    }, [focusField, trackData]);

    return (
        <AppForm
            disabled={isReadMode}
            form={form}
            layout="vertical"
            showSubmit={false}
            variant={isReadMode ? 'underlined' : 'outlined'}
        >
            <div
                className="flex h-[80vh] flex-col gap-12 overflow-y-auto rounded-lg px-2 py-2 pr-1"
                style={{
                    backgroundColor: token.colorBgContainer,
                }}
            >
                <TrackAndArtistSection
                    trackData={trackData}
                    debouncedUpdateTrackDraft={updateTrackDraft}
                    index={index}
                />

                <TrackContributorsSection
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
        </AppForm>
    );
}
