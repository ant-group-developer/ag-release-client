import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import { showNotification } from '@/helpers/messages-helper';
import { useGetListSimpleArtistRole } from '@/modules/artist-role/hooks/use-get-list-simple-artist-role';
import { useBulkCreateReleaseContributor } from '@/modules/release-contributor/hooks/use-bulk-create-release-contributor';
import { useDeleteReleaseContributor } from '@/modules/release-contributor/hooks/use-delete-release-contributor';
import { ReleasesData } from '@/modules/releases/types';
import { CloseOutlined } from '@ant-design/icons';
import {
    Col,
    DatePicker,
    FormInstance,
    Input,
    Popconfirm,
    Row,
    Select,
    Tag,
} from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

interface AdditionalTabProps {
    dataEdit?: ReleasesData;
    onFieldUpdate?: (payload: Record<string, any>) => void;
    form: FormInstance;
}

const VIDEO_VERSION_OPTIONS = [
    { value: 'Lyric Video', label: 'Lyric Video' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Alternate Version', label: 'Alternate Version' },
    { value: 'Original Content', label: 'Original Content' },
    { value: 'Audio', label: 'Audio' },
    { value: 'Visualizer', label: 'Visualizer' },
    { value: 'Behind The Scenes', label: 'Behind The Scenes' },
    { value: 'Teaser', label: 'Teaser' },
    { value: 'Live', label: 'Live' },
    { value: 'Podcast', label: 'Podcast' },
    { value: 'Documentary', label: 'Documentary' },
    { value: 'Official', label: 'Official' },
];

export default function AdditionalTab({
    dataEdit,
    onFieldUpdate,
    form,
}: AdditionalTabProps) {
    const messages = useTranslations();
    const { bulkCreateReleaseContributor } = useBulkCreateReleaseContributor();
    const { deleteReleaseContributor } = useDeleteReleaseContributor();
    const { artistsRolesData } = useGetListSimpleArtistRole();

    const composerRole = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('composer')
    );
    const composerRoleId = composerRole?.id;

    const editorRole = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('editor')
    );
    const editorRoleId = editorRole?.id;

    const producerRole = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('producer')
    );
    const producerRoleId = producerRole?.id;

    const directorRole = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('director')
    );
    const directorRoleId = directorRole?.id;

    const handleBlurContributor = (
        fieldName: string,
        roleId: string | undefined
    ) => {
        const releaseId = dataEdit?.id;
        if (!releaseId) return;

        const newArtistIds = form.getFieldValue(fieldName) || [];

        const currentContributorIds =
            dataEdit.releaseContributors
                ?.filter((c) => c.artistRole?.id === roleId)
                .map((c) => c.artistId) || [];

        const addedIds = newArtistIds.filter(
            (id: string) => !currentContributorIds.includes(id)
        );

        if (addedIds.length > 0) {
            if (!roleId) {
                showNotification(
                    'error',
                    messages('releaseVideo.fields.roleNotFound')
                );
                form.setFieldValue(fieldName, currentContributorIds);
                return;
            }
            bulkCreateReleaseContributor({
                payload: {
                    items: addedIds.map((id: string) => ({
                        artistId: id,
                        artistRoleId: roleId,
                        releaseId,
                        addContributorToTracks: false,
                    })),
                },
            });
        }
    };

    const handleDeselectContributor = (
        artistId: string,
        roleId: string | undefined
    ) => {
        if (!dataEdit?.id) return;
        const contributor = dataEdit.releaseContributors?.find(
            (c) => c.artistId === artistId && c.artistRole?.id === roleId
        );
        if (contributor?.id) {
            deleteReleaseContributor({ id: contributor.id });
        }
    };

    const handleBlurComposer = () =>
        handleBlurContributor('composers', composerRoleId);
    const handleDeselectComposer = (artistId: string) =>
        handleDeselectContributor(artistId, composerRoleId);

    const handleBlurEditor = () =>
        handleBlurContributor('editors', editorRoleId);
    const handleDeselectEditor = (artistId: string) =>
        handleDeselectContributor(artistId, editorRoleId);

    const handleBlurProducer = () =>
        handleBlurContributor('producers', producerRoleId);
    const handleDeselectProducer = (artistId: string) =>
        handleDeselectContributor(artistId, producerRoleId);

    const handleBlurDirector = () =>
        handleBlurContributor('directors', directorRoleId);
    const handleDeselectDirector = (artistId: string) =>
        handleDeselectContributor(artistId, directorRoleId);

    const tagRender = (props: any) => {
        const { label, closable, onClose } = props;
        const onPreventMouseDown = (
            event: React.MouseEvent<HTMLSpanElement>
        ) => {
            event.preventDefault();
            event.stopPropagation();
        };

        return (
            <Tag
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={(e) => {
                    e.preventDefault();
                }}
                closeIcon={
                    closable ? (
                        <Popconfirm
                            title={messages('delete.confirmTitle')}
                            onConfirm={onClose}
                            onCancel={(e) => e?.stopPropagation()}
                        >
                            <span onClick={(e) => e.stopPropagation()}>
                                <CloseOutlined className="text-[10px]" />
                            </span>
                        </Popconfirm>
                    ) : null
                }
                style={{
                    marginRight: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                }}
            >
                {label}
            </Tag>
        );
    };

    const maxYear = dayjs().year() + 1;
    const disabledYear = (current: dayjs.Dayjs) => {
        return current && current.year() > maxYear;
    };

    return (
        <div className="mx-auto w-full pb-8 pt-4">
            <Row gutter={16}>
                {/* <Col span={8}>
                    <AppFormItem
                        name="upc"
                        label={messages('releaseVideo.fields.upc')}
                        rules={[
                            {
                                min: 10,
                                message: messages('validation.min', {
                                    number: 10,
                                }),
                            },
                            {
                                max: 14,
                                message: messages('validation.max', {
                                    number: 14,
                                }),
                            },
                        ]}
                    >
                        <Input
                            placeholder={messages('releaseVideo.fields.upc')}
                            allowClear
                            onBlur={(e) =>
                                onFieldUpdate?.({ upc: e.target.value })
                            }
                        />
                    </AppFormItem>
                </Col> */}

                <Col span={8}>
                    <AppFormItem
                        name="version"
                        label={messages('releaseVideo.fields.videoVersion')}
                    >
                        <Select
                            placeholder={messages('common.select')}
                            allowClear
                            onChange={(value) =>
                                onFieldUpdate?.({ version: value })
                            }
                            options={VIDEO_VERSION_OPTIONS}
                        />
                    </AppFormItem>
                </Col>

                <Col span={8}>
                    <AppFormItem
                        name={['video', 'partnerCustomId1']}
                        label={messages('releaseVideo.fields.partnerCustomId1')}
                    >
                        <Input
                            placeholder={messages(
                                'releaseVideo.fields.partnerCustomId1'
                            )}
                            allowClear
                            onBlur={(e) => {
                                const val = e.target.value;
                                if (val !== dataEdit?.video?.partnerCustomId1) {
                                    onFieldUpdate?.({
                                        video: {
                                            partnerCustomId1: val,
                                        },
                                    });
                                }
                            }}
                        />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem
                        name={['video', 'partnerCustomId2']}
                        label={messages('releaseVideo.fields.partnerCustomId2')}
                    >
                        <Input
                            placeholder={messages(
                                'releaseVideo.fields.partnerCustomId2'
                            )}
                            allowClear
                            onBlur={(e) => {
                                const val = e.target.value;
                                if (val !== dataEdit?.video?.partnerCustomId2) {
                                    onFieldUpdate?.({
                                        video: {
                                            partnerCustomId2: val,
                                        },
                                    });
                                }
                            }}
                        />
                    </AppFormItem>
                </Col>
            </Row>

            <div className="mb-4 mt-6 border-b border-gray-100 pb-2 text-base font-bold">
                {messages('releaseVideo.fields.credits')}
            </div>

            <Row gutter={16}>
                <Col span={8}>
                    <AppFormItem
                        name="composers"
                        label={messages('releaseVideo.fields.composers')}
                    >
                        <ArtistSelect
                            mode="multiple"
                            placeholder={messages('artist.select')}
                            onBlur={handleBlurComposer}
                            onDeselect={handleDeselectComposer}
                            tagRender={tagRender}
                            artistId={dataEdit?.releaseContributors
                                ?.filter((c) => c.artistRole?.id === composerRoleId)
                                ?.map((c) => c.artistId)
                                .join(',')}
                        />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem
                        name="editors"
                        label={messages('releaseVideo.fields.editors')}
                    >
                        <ArtistSelect
                            mode="multiple"
                            placeholder={messages('artist.select')}
                            onBlur={handleBlurEditor}
                            onDeselect={handleDeselectEditor}
                            tagRender={tagRender}
                            artistId={dataEdit?.releaseContributors
                                ?.filter((c) => c.artistRole?.id === editorRoleId)
                                ?.map((c) => c.artistId)
                                .join(',')}
                        />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem
                        name="producers"
                        label={messages('releaseVideo.fields.producers')}
                    >
                        <ArtistSelect
                            mode="multiple"
                            placeholder={messages('artist.select')}
                            onBlur={handleBlurProducer}
                            onDeselect={handleDeselectProducer}
                            tagRender={tagRender}
                            artistId={dataEdit?.releaseContributors
                                ?.filter((c) => c.artistRole?.id === producerRoleId)
                                ?.map((c) => c.artistId)
                                .join(',')}
                        />
                    </AppFormItem>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <AppFormItem
                        name="directors"
                        label={messages('releaseVideo.fields.directors')}
                    >
                        <ArtistSelect
                            mode="multiple"
                            placeholder={messages('artist.select')}
                            onBlur={handleBlurDirector}
                            onDeselect={handleDeselectDirector}
                            tagRender={tagRender}
                            artistId={dataEdit?.releaseContributors
                                ?.filter((c) => c.artistRole?.id === directorRoleId)
                                ?.map((c) => c.artistId)
                                .join(',')}
                        />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem
                        name="cLineOwner"
                        label={messages('releaseVideo.fields.copyright')}
                    >
                        <Input
                            placeholder={messages(
                                'releaseVideo.fields.copyright'
                            )}
                            allowClear
                            onBlur={(e) => {
                                const val = e.target.value;
                                if (val !== dataEdit?.cLineOwner) {
                                    onFieldUpdate?.({ cLineOwner: val });
                                }
                            }}
                        />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem
                        name="cLineYear"
                        label={messages('releaseVideo.fields.copyrightYear')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <DatePicker
                            picker="year"
                            placeholder={messages(
                                'releaseVideo.fields.copyrightYear'
                            )}
                            className="w-full"
                            allowClear
                            disabledDate={disabledYear}
                            onChange={(date) => {
                                onFieldUpdate?.({
                                    cLineYear: date ? date.year() : null,
                                });
                            }}
                        />
                    </AppFormItem>
                </Col>
            </Row>
        </div>
    );
}
