import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { Form, Tabs, theme } from 'antd';
import { useTranslations } from 'next-intl';

import AppForm from '@/components/ui/antd-form/form';
import { DATE_FORMAT } from '@/enums/common';
import { convertSecondsToHoursMinutes } from '@/helpers/common';
import { TrackData } from '@/modules/releases/types';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useCallback, useEffect } from 'react';
import AudioSpecSection from '../collapse/view-all-collapse/audio-spec-section';
import GenreSection from '../collapse/view-all-collapse/genre-section';
import LanguageSection from '../collapse/view-all-collapse/language-section';
import OtherSection from '../collapse/view-all-collapse/other-section';
import TrackAndArtistSection from '../collapse/view-all-collapse/track-and-artist-section';
import ViewAll from '../form/view-all';

type Props = {} & Omit<AppModalProps, 'children'>;

export default function TrackDetailModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const { token } = theme.useToken();
    const { trackId, index } = useModalStore<{
        trackId: TrackData['id'];
        index: number;
    }>((state) => state.dataEdit);
    // const { isActive, active, deActive } = useActive();
    const { updateTrackDraft } = useUpdateTrackDraft();
    const { trackData, isLoading } = useGetDetailTrack(trackId);

    const debouncedUpdate = useCallback(
        debounce((id, data) => {
            if (!trackId) return;
            const variables: UpdateVariables<
                TrackData['id'],
                UpdateTrackPayload
            > = {
                id,
                payload: data,
            };
            updateTrackDraft(variables);
        }, 800),
        [trackId]
    );

    const items = [
        {
            key: `${trackId}-track-form`,
            label: (
                <span className="font-medium">
                    {messages('track.label')} & {messages('artist.label')}
                </span>
            ),
            children: (
                // <TracksForm
                //     key={`${trackId}-${trackData.title}-track-form-content`}
                //     trackData={trackData}
                //     index={index}
                // />
                <div className="max-h-[80vh] overflow-y-auto">
                    <TrackAndArtistSection
                        trackData={trackData}
                        debouncedUpdateTrackDraft={(data) =>
                            debouncedUpdate(trackId, data)
                        }
                        index={index}
                    />
                </div>
            ),
        },
        {
            key: `${trackId}-metadata-form`,
            label: (
                <span className="font-medium">
                    {messages('release.otherMetadata')}
                </span>
            ),
            children: (
                // <OtherMetadataForm
                //     key={`${trackId}-metadata-form-content`}
                //     trackData={trackData}
                // />
                <div className="max-h-[80vh] space-y-4 overflow-y-auto">
                    <GenreSection
                        index={index}
                        debouncedUpdateTrackDraft={(data) =>
                            debouncedUpdate(trackId, data)
                        }
                        trackData={trackData}
                    />
                    <LanguageSection
                        index={index}
                        debouncedUpdateTrackDraft={(data) =>
                            debouncedUpdate(trackId, data)
                        }
                        trackData={trackData}
                    />
                    <OtherSection
                        index={index}
                        debouncedUpdateTrackDraft={(data) =>
                            debouncedUpdate(trackId, data)
                        }
                        trackData={trackData}
                    />
                </div>
            ),
        },
        {
            key: `${trackId}-audio-specs`,
            label: (
                <span className="font-medium">
                    {messages('common.specification')}
                </span>
            ),
            children: (
                // <AudioSpecifications
                //     key={`${trackId}-audio-specs-content`}
                //     trackData={trackData}
                // />
                <AudioSpecSection
                    index={index}
                    debouncedUpdateTrackDraft={(data) =>
                        debouncedUpdate(trackId, data)
                    }
                    trackData={trackData}
                />
            ),
        },
        {
            key: `${trackId}-view-all`,
            label: (
                <span className="font-medium">
                    {messages('common.viewAll')}
                </span>
            ),
            children: (
                <ViewAll
                    key={`${trackId}-view-all`}
                    trackData={trackData}
                    updateTrackDraft={(data) => debouncedUpdate(trackId, data)}
                    index={index}
                />
            ),
        },
    ];

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

    return (
        <AppModal
            {...props}
            open
            title={<p>{trackData.title}</p>}
            onOk={form.submit}
            onCancel={() => {
                closeModal();
                form.resetFields();
            }}
            footer={null}
            width={'60vw'}
            style={{
                top: '1rem',
            }}
            spinning={isLoading}
            styles={{
                content: { backgroundColor: token?.colorBgLayout },
                header: { backgroundColor: token?.colorBgLayout },
            }}
            // className="bg-content"
        >
            <AppForm form={form} layout="vertical" showSubmit={false}>
                <Tabs
                    className="rounded"
                    items={items}
                    defaultActiveKey={`${trackId}-view-all`}
                />
            </AppForm>
        </AppModal>
    );
}
