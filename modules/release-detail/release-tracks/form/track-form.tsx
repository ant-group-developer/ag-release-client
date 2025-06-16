import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconInfoTooltip from '@/components/ui/tooltip/icon-info-tooltip';
import { languageList } from '@/constants/fakeData';
import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { TrackData } from '@/modules/tracks/types';
import { Button, Form, Input, Select, Switch } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import ArtistCard from '../../release-detail-form/artist-card';

type Props = {
    trackData: TrackData;
    checkTrackValid: (boolean: boolean) => void;
};

export default function TracksForm({ trackData, checkTrackValid }: Props) {
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

    // const handleValuesChange = (changedValues: any) => {
    //     // setTimeout(() => {
    //     form.validateFields()
    //         .then((values) => {
    //             console.log('🚀 ~ .then ~ values:', values);
    //             checkTrackValid(true);
    //             const newValue = {
    //                 ...formValues,
    //                 tracks: formValues?.tracks?.map((track: TrackData) => {
    //                     if (track.id === trackData.id) {
    //                         return {
    //                             ...track,
    //                             ...values,
    //                         };
    //                     }
    //                     return track;
    //                 }),
    //             };
    //             setFormValues(newValue);
    //             console.log('then');
    //         })
    //         .catch((error) => {
    //             checkTrackValid(false);
    //             console.log('catch');
    //         });
    //     // }, 0);
    // };

    const handleFieldChange = (changedFields: any, allFields: any) => {
        const hasErrors = allFields.some(
            (field: any) => field.errors.length > 0
        );
        if (!hasErrors) return checkTrackValid(!hasErrors);

        if (!hasErrors) {
            // Lấy changed values
            const changedValues = changedFields.reduce(
                (acc: any, field: any) => {
                    if (field.name && field.name.length > 0) {
                        acc[field.name[0]] = field.value;
                    }
                    return acc;
                },
                {}
            );

            // Update store
            const newValue = {
                ...formValues,
                tracks: formValues?.tracks?.map((track: TrackData) => {
                    if (track.id === trackData.id) {
                        return {
                            ...track,
                            ...changedValues,
                        };
                    }
                    return track;
                }),
            };
            setFormValues(newValue);
        }
    };

    useEffect(() => {
        form.setFieldsValue({
            ...formValues?.tracks?.find(
                (track: any) => track.id === trackData.id
            ),
            trackName: trackData.title,
            artists: TrackArtists,
            isAddArtistsFromRelease: false,
        });

        setFormValues({
            ...formValues,
            tracks: formValues?.tracks?.map((track: TrackData) => {
                if (track.id === trackData.id) {
                    return {
                        ...track,
                        trackName: trackData.title,
                        artists: TrackArtists,
                        isAddArtistsFromRelease: false,
                        genres: trackData.genres,
                    };
                }
                return track;
            }),
        });

        setTimeout(() => {
            form.validateFields()
                .then((values) => {
                    checkTrackValid(true);
                })
                .catch((error) => {
                    checkTrackValid(false);
                });
        }, 0);
    }, []);

    return (
        <div>
            <AppForm
                form={form}
                layout="vertical"
                showSubmit={false}
                // onValuesChange={(changedValues, allValues) =>
                //     handleValuesChange(changedValues)
                // }
                onFieldsChange={(changedFields, allFields) => {
                    handleFieldChange(changedFields, allFields);
                }}
            >
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
                                                        TYPE_MODAL_RELEASE_TRACK_ARTIST_LIST.DELETE_ARTIST,
                                                        { trackData, artist }
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
        </div>
    );
}
