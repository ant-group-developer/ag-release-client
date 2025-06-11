import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import IconInfoTooltip from '@/components/ui/tooltip/icon-info-tooltip';
import { languageList } from '@/constants/fakeData';
import useModalStore from '@/hooks/use-modal';
import {
    TYPE_MODAL_RELEASE_ARTIST_LIST,
    TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { Button, Form, Input, Select, Switch } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import ArtistCard from '../../release-detail-form/artist-card';

type Props = {
    trackData: TrackData;
};

export default function TracksForm({ trackData }: Props) {
    const messages = useTranslations();

    const originalSourceList = [
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    Tác phẩm gốc{' '}
                    <IconInfoTooltip title="Tác phẩm gốc là tác phẩm được tạo ra đầu tiên, không phải bất kỳ bản cover hoặc remix nào." />
                </span>
            ),
            value: 'original',
        },
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    Bản cover
                    <IconInfoTooltip title="Bản cover là bản nhạc được cover lại từ tác phẩm gốc, có thể có sự thay đổi về âm nhạc, lời bài hát, hoặc cả hai." />
                </span>
            ),
            value: 'cover',
        },
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    Bản remix
                    <IconInfoTooltip title="Bản remix là bản nhạc được tạo ra từ tác phẩm gốc, có thể có sự thay đổi về âm nhạc, lời bài hát, hoặc cả hai." />
                </span>
            ),
            value: 'remix',
        },
    ];
    const [form] = Form.useForm();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const TrackArtists = trackData.artists;
    const openModal = useModalStore((state) => state.openModal);
    const isAddArtistsFromRelease = useWatch('isAddArtistsFromRelease', form);
    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit);

    useEffect(() => {
        form.setFieldsValue({
            trackName: trackData.title,
            artists: TrackArtists,
        });
    }, [trackData, TrackArtists]);

    const handleDeleteArtistTrack = (artistId: string) => {
        const updatedArtist = TrackArtists.filter(
            (artist) => artist.id !== artistId
        );

        setFormValues({
            ...formValues,
            tracks: formValues.tracks.map((track: any) =>
                track.id === trackData.id
                    ? { ...track, artists: updatedArtist }
                    : track
            ),
        });
        closeModal();
    };

    return (
        <div>
            <AppForm form={form} layout="vertical" showSubmit={false}>
                <div className="grid grid-cols-2 gap-4">
                    <AppFormItem
                        label="Tên bài hát"
                        name="trackName"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>

                    <AppFormItem label="ISRC" name="isrc">
                        <Input allowClear />
                    </AppFormItem>
                    {/* <AppFormItem
                        label="Tên hiển thị"
                        name="nameDisplay"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem> */}

                    <AppFormItem
                        label="Nguồn gốc"
                        name="source"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Select
                            className="w-full"
                            options={originalSourceList}
                            allowClear
                        />
                    </AppFormItem>

                    <AppFormItem
                        label="Ngôn ngữ bài hát"
                        name="languageTrack"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Select
                            className="w-full"
                            options={languageList}
                            allowClear
                            showSearch
                        />
                    </AppFormItem>

                    <div className="col-span-2">
                        <AppFormItem
                            label="Thêm tất cả nghệ sĩ từ phát hành ?"
                            name="isAddArtistsFromRelease"
                        >
                            <Switch />
                        </AppFormItem>
                        {!isAddArtistsFromRelease && (
                            <div>
                                <div>
                                    <Button
                                        onClick={() =>
                                            openModal(
                                                TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.ADD_ARTIST,
                                                trackData
                                            )
                                        }
                                        shape="round"
                                        className="mb-4"
                                    >
                                        Thêm nghệ sĩ
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {TrackArtists.map(
                                        (artist: any, index: number) => (
                                            <ArtistCard
                                                data={artist}
                                                onDelete={() =>
                                                    openModal(
                                                        TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST,
                                                        artist
                                                    )
                                                }
                                                onClick={() =>
                                                    openModal(
                                                        TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.EDIT_ARTIST,
                                                        artist
                                                    )
                                                }
                                                key={index}
                                                index={index}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </AppForm>
            {typeModal === TYPE_MODAL_RELEASE_ARTIST_LIST.DELETE_ARTIST && (
                <AppConfirm
                    open
                    modalTitle="Xóa nghệ sĩ"
                    paragraph="Bạn có chắc chắn muốn xóa nghệ sĩ này không?"
                    onCancel={closeModal}
                    onOk={() => handleDeleteArtistTrack(dataEdit.id)}
                />
            )}
        </div>
    );
}
