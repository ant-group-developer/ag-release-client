import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { Form, Tabs } from 'antd';
import { useTranslations } from 'next-intl';

import { useActive } from '@/hooks/use-active';
import { TrackData } from '@/modules/releases/types';
import { useGetDetailTrack } from '@/modules/tracks/hooks/use-get-detail-tracks';
import { useUpdateTrackDraft } from '@/modules/tracks/hooks/use-update-track-draft';
import { UpdateTrackPayload } from '@/modules/tracks/types/payload';
import { UpdateVariables } from '@/types/api';
import { debounce } from 'lodash';
import { useCallback } from 'react';
import AudioSpecifications from '../form/audio-specifications';
import OtherMetadataForm from '../form/other-metadata-form';
import TracksForm from '../form/track-form';
import ViewAll from '../form/view-all';

type Props = {} & Omit<AppModalProps, 'children'>;

export default function TrackDetailModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const { record, index } = useModalStore<{
        record: TrackData;
        index: number;
    }>((state) => state.dataEdit);
    const { isActive, active, deActive } = useActive();
    const { updateTrackDraft } = useUpdateTrackDraft();
    const { trackData, isFetching } = useGetDetailTrack(record?.id);

    const debouncedUpdate = useCallback(
        debounce((id, data) => {
            if (!record.id) return;
            const variables: UpdateVariables<
                TrackData['id'],
                UpdateTrackPayload
            > = {
                id,
                payload: data,
            };
            updateTrackDraft(variables);
        }, 800),
        [record.id]
    );

    const items = [
        {
            key: `${record.id}-track-form`,
            label: (
                <span className="font-medium">
                    {messages('track.label')} & {messages('artist.label')}
                </span>
            ),
            children: (
                <TracksForm
                    key={`${record.id}-${record.title}-track-form-content`}
                    trackData={trackData}
                    index={index}
                />
            ),
        },
        {
            key: `${record.id}-metadata-form`,
            label: (
                <span className="font-medium">
                    {messages('release.otherMetadata')}
                </span>
            ),
            children: (
                <OtherMetadataForm
                    key={`${record.id}-metadata-form-content`}
                    trackData={trackData}
                />
            ),
        },
        {
            key: `${record.id}-audio-specs`,
            label: (
                <span className="font-medium">
                    {messages('common.specification')}
                </span>
            ),
            children: (
                <AudioSpecifications
                    key={`${record.id}-audio-specs-content`}
                    trackData={trackData}
                />
            ),
        },
        {
            key: `${record.id}-view-all`,
            label: (
                <span className="font-medium">
                    {messages('common.viewAll')}
                </span>
            ),
            children: (
                <ViewAll
                    key={`${record.id}-view-all`}
                    trackData={trackData}
                    updateTrackDraft={(data) =>
                        debouncedUpdate(record.id, data)
                    }
                    index={index}
                />
            ),
        },
    ];

    return (
        <AppModal
            {...props}
            open
            title={record.title}
            onOk={form.submit}
            onCancel={() => {
                closeModal();
                form.resetFields();
            }}
            footer={null}
            confirmLoading={isActive}
            loading={isActive}
            width={'70vw'}
            style={{ top: '1rem' }}
            spinning={isFetching}
        >
            <Tabs items={items} defaultActiveKey={`${record.id}-view-all`} />
        </AppModal>
    );
}
