import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { Form, Menu, Tabs, theme } from 'antd';
import { useTranslations } from 'next-intl';

import AppForm from '@/components/ui/antd-form/form';
import { DATE_FORMAT } from '@/enums/common';
import { convertSecondsToHoursMinutes } from '@/helpers/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { TrackData } from '@/modules/releases/types';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import AudioSpecSection from '../collapse/view-all-collapse/audio-spec-section';
import GenreSection from '../collapse/view-all-collapse/genre-section';
import LanguageSection from '../collapse/view-all-collapse/language-section';
import OtherSection from '../collapse/view-all-collapse/other-section';
import TrackAndArtistSection from '../collapse/view-all-collapse/track-and-artist-section';
import TrackContributorsSection from '../collapse/view-all-collapse/track-contributors-section';
import ViewAll from '../form/view-all';

type Props = {
    tracks?: TrackData[];
} & Omit<AppModalProps, 'children'>;

export default function TrackDetailModal({ tracks, ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    // const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const { token } = theme.useToken();
    const { trackId, index } = useModalStore<{
        trackId: TrackData['id'];
        index: number;
    }>((state) => state.dataEdit);
    // const { isActive, active, deActive } = useActive();
    const [selectedTrackId, setSelectedTrackId] = useState(trackId);
    const selectedIndex =
        tracks?.findIndex((t) => t.id === selectedTrackId) ?? index;
    const { updateTrackDraft } = useUpdateTrackDraft();
    const { trackData, isLoading } = useGetDetailTrack(selectedTrackId);
    const releaseAction = useReleaseActionStore((s) => s.action);
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    const debouncedUpdate = useCallback(
        debounce((id, data) => {
            if (!selectedTrackId) return;
            const variables: UpdateVariables<
                TrackData['id'],
                UpdateTrackPayload
            > = {
                id,
                payload: data,
            };
            updateTrackDraft(variables);
        }, 500),
        [selectedTrackId]
    );

    const items = [
        {
            key: `${selectedTrackId}-track-form`,
            label: (
                <span className="font-medium">
                    {messages('track.label')} & {messages('artist.label')}
                </span>
            ),
            children: (
                <div className="max-h-[80vh] space-y-4 overflow-y-auto">
                    <TrackAndArtistSection
                        trackData={trackData}
                        debouncedUpdateTrackDraft={(data) =>
                            debouncedUpdate(selectedTrackId, data)
                        }
                        index={selectedIndex}
                    />

                    <TrackContributorsSection
                        trackData={trackData}
                        debouncedUpdateTrackDraft={updateTrackDraft}
                        index={selectedIndex}
                    />
                </div>
            ),
        },
        {
            key: `${selectedTrackId}-metadata-form`,
            label: (
                <span className="font-medium">
                    {messages('release.otherMetadata')}
                </span>
            ),
            children: (
                <div className="max-h-[80vh] space-y-4 overflow-y-auto">
                    <GenreSection
                        index={selectedIndex}
                        debouncedUpdateTrackDraft={(data) =>
                            debouncedUpdate(selectedTrackId, data)
                        }
                        trackData={trackData}
                    />
                    <LanguageSection
                        index={selectedIndex}
                        debouncedUpdateTrackDraft={(data) =>
                            debouncedUpdate(selectedTrackId, data)
                        }
                        trackData={trackData}
                    />
                    <OtherSection
                        index={selectedIndex}
                        debouncedUpdateTrackDraft={(data) =>
                            debouncedUpdate(selectedTrackId, data)
                        }
                        trackData={trackData}
                    />
                </div>
            ),
        },
        {
            key: `${selectedTrackId}-audio-specs`,
            label: (
                <span className="font-medium">
                    {messages('common.specification')}
                </span>
            ),
            children: (
                <AudioSpecSection
                    index={selectedIndex}
                    debouncedUpdateTrackDraft={(data) =>
                        debouncedUpdate(selectedTrackId, data)
                    }
                    trackData={trackData}
                />
            ),
        },
        {
            key: `${selectedTrackId}-view-all`,
            label: (
                <span className="font-medium">
                    {messages('common.viewAll')}
                </span>
            ),
            children: (
                <ViewAll
                    key={`${selectedTrackId}-view-all`}
                    trackData={trackData}
                    updateTrackDraft={(data) =>
                        debouncedUpdate(selectedTrackId, data)
                    }
                    index={selectedIndex}
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
            width={'75vw'}
            style={{
                top: '1rem',
            }}
            spinning={isLoading}
            styles={{
                content: { backgroundColor: token?.colorBgLayout },
                header: { backgroundColor: token?.colorBgLayout },
            }}
        >
            <div className="flex gap-4 overflow-x-hidden">
                {/* Track list sidebar */}
                {tracks && tracks.length > 0 && (
                    <div
                        className="flex w-[240px] shrink-0 flex-col border-r pt-3"
                        style={{
                            maxHeight: '80vh',
                            borderColor: token?.colorBorderSecondary,
                        }}
                    >
                        <div className="mb-2 px-3">
                            <p
                                className="text-[10px] font-bold uppercase tracking-wider"
                                style={{ color: token?.colorTextDescription }}
                            >
                                {messages('common.tracks')} ({tracks.length})
                            </p>
                        </div>

                        <Menu
                            mode="inline"
                            selectedKeys={[selectedTrackId as string]}
                            onClick={({ key }: { key: string }) => {
                                setSelectedTrackId(key);
                                form.resetFields();
                            }}
                            className="flex-1 !bg-transparent"
                            style={{
                                borderInlineEnd: 'none',
                                overflowY: 'auto',
                            }}
                            items={tracks.map((track, i) => ({
                                key: track.id,
                                label: (
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <span className="truncate font-medium">
                                            {track.title || 'Untitled'}
                                        </span>
                                    </div>
                                ),
                            }))}
                            inlineIndent={12}
                        />
                    </div>
                )}

                {/* Main content */}
                <div className="min-w-0 flex-1">
                    <AppForm
                        form={form}
                        disabled={isReadMode}
                        layout="vertical"
                        showSubmit={false}
                        variant={isReadMode ? 'underlined' : 'outlined'}
                    >
                        <Tabs
                            className="rounded"
                            items={items}
                            defaultActiveKey={`${selectedTrackId}-view-all`}
                        />
                    </AppForm>
                </div>
            </div>
        </AppModal>
    );
}
