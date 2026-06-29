import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import GenresSelect from '@/components/ui/select/genres-select';
import LanguageSelect from '@/components/ui/select/language-select';
import { MAX_NOTE_LENGTH } from '@/constants/validate';
import { showNotification } from '@/helpers/messages-helper';
import { usePermission } from '@/hooks/use-permission';
import { useGetListSimpleArtistRole } from '@/modules/artist-role/hooks/use-get-list-simple-artist-role';
import { PERMISSION } from '@/modules/auth/constants/permission';
import ChannelSelect from '@/modules/channels/components/select/channel-select';
import { useBulkCreateReleaseArtist } from '@/modules/release-artist/hooks/use-bulk-create-release-artist';
import { useDeleteReleaseArtist } from '@/modules/release-artist/hooks/use-delete-release-artist';
import { useBulkCreateReleaseContributor } from '@/modules/release-contributor/hooks/use-bulk-create-release-contributor';
import { useDeleteReleaseContributor } from '@/modules/release-contributor/hooks/use-delete-release-contributor';
import {
    RELEASE_AI_CONTENT,
    RELEASE_MADE_FOR_KIDS,
    RELEASES_STATUS,
} from '@/modules/releases/enums';
import { ReleasesData } from '@/modules/releases/types';
import { CloseOutlined, CopyOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    FormInstance,
    Input,
    Popconfirm,
    Row,
    Select,
    Tag,
    Tooltip,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ManageCollaboratorsModal from './manage-collaborators-modal';

interface MetadataFieldsProps {
    dataEdit?: ReleasesData;
    onFieldUpdate?: (payload: Record<string, any>) => void;
    form: FormInstance;
}

export default function MetadataFields({
    dataEdit,
    onFieldUpdate,
    form,
}: MetadataFieldsProps) {
    const messages = useTranslations();
    const { hasPermission } = usePermission();
    const [isManageCollaboratorsOpen, setIsManageCollaboratorsOpen] =
        useState(false);
    const { bulkCreateReleaseArtist } = useBulkCreateReleaseArtist();
    const { deleteReleaseArtist } = useDeleteReleaseArtist();
    const { bulkCreateReleaseContributor } = useBulkCreateReleaseContributor();
    const { deleteReleaseContributor } = useDeleteReleaseContributor();
    const { artistsRolesData } = useGetListSimpleArtistRole();

    const featuredRole = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('featured')
    );
    const featuredRoleId = featuredRole?.id;

    const isUpdateForm = !!dataEdit?.id;
    const canEditReleaseVideo =
        !isUpdateForm || hasPermission(PERMISSION.RELEASE_VIDEO.UPDATE);

    const isCanEditChannel =
        canEditReleaseVideo &&
        (!dataEdit?.id ||
            dataEdit?.status === RELEASES_STATUS.DRAFT ||
            dataEdit?.status === RELEASES_STATUS.FAILED ||
            dataEdit?.status === RELEASES_STATUS.TAKEN_DOWN);

    const handleArtistsBlur = () => {
        const releaseId = dataEdit?.id;
        if (!releaseId) return showNotification('error', 'Release not found!');

        const newArtistIds = form.getFieldValue('artistIds') || [];

        const currentArtistIds =
            dataEdit.releaseArtists?.map((a) => a.artistId) || [];

        const addedIds = newArtistIds.filter(
            (id: string) => !currentArtistIds.includes(id)
        );

        if (addedIds.length > 0) {
            bulkCreateReleaseArtist({
                payload: {
                    items: addedIds.map((id: string) => ({
                        artistId: id,
                        releaseId,
                        addArtistToTracks: false,
                    })),
                },
            });
        }
    };

    const handleDeselect = (artistId: string) => {
        if (!dataEdit?.id) return;
        const releaseArtist = dataEdit.releaseArtists?.find(
            (a) => a.artistId === artistId
        );
        if (releaseArtist?.id) {
            deleteReleaseArtist({
                id: releaseArtist.id,
            });
        }
    };

    const handleDeselectFeatured = (artistId: string) => {
        if (!dataEdit?.id) return;
        const contributor = dataEdit.releaseContributors?.find(
            (c) =>
                c.artistId === artistId && c.artistRole?.id === featuredRoleId
        );
        if (contributor?.id) {
            deleteReleaseContributor({
                id: contributor.id,
            });
        }
    };

    const handleFeaturedArtistsBlur = () => {
        const releaseId = dataEdit?.id;
        if (!releaseId || !featuredRoleId) return;

        const newArtistIds = form.getFieldValue('featuredArtistIds') || [];

        const currentContributorIds =
            dataEdit.releaseContributors
                ?.filter((c) => c.artistRole?.id === featuredRoleId)
                .map((c) => c.artistId) || [];

        const addedIds = newArtistIds.filter(
            (id: string) => !currentContributorIds.includes(id)
        );

        if (addedIds.length > 0) {
            bulkCreateReleaseContributor({
                payload: {
                    items: addedIds.map((id: string) => ({
                        artistId: id,
                        artistRoleId: featuredRoleId,
                        releaseId,
                        addContributorToTracks: false,
                    })),
                },
            });
        }
    };

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

    return (
        <>
            {/* Title (Full Width) */}
            <AppFormItem
                name="title"
                label={messages('releaseVideo.fields.videoTitle')}
                required
                rules={[
                    {
                        required: true,
                        message: messages('validation.input'),
                    },
                    {
                        max: 100,
                        message: messages('validation.stringMax', {
                            max: 100,
                            field: messages('releaseVideo.fields.videoTitle'),
                        }),
                    },
                ]}
            >
                <Input
                    placeholder={messages(
                        'releaseVideo.fields.videoTitlePlaceholder'
                    )}
                    allowClear
                    showCount
                    maxLength={100}
                    onBlur={(e) => {
                        if (e.target.value?.trim()) {
                            onFieldUpdate?.({ title: e.target.value });
                        }
                    }}
                />
            </AppFormItem>

            {/* Artist Select Multiple */}
            <AppFormItem
                name="artistIds"
                label={messages('releaseArtist.label')}
                required
                rules={[
                    {
                        required: true,
                        message: messages('validation.select'),
                    },
                ]}
            >
                <ArtistSelect
                    mode="multiple"
                    placeholder={messages('artist.select')}
                    onBlur={handleArtistsBlur}
                    onDeselect={handleDeselect}
                    tagRender={tagRender}
                    artistId={dataEdit?.releaseArtists
                        ?.map((a) => a.artistId)
                        .join(',')}
                />
            </AppFormItem>

            {/* Featured Artist Select Multiple */}
            <AppFormItem
                name="featuredArtistIds"
                label={messages('releaseVideo.fields.featuredArtists')}
            >
                <ArtistSelect
                    mode="multiple"
                    placeholder={messages('artist.select')}
                    onBlur={handleFeaturedArtistsBlur}
                    onDeselect={handleDeselectFeatured}
                    tagRender={tagRender}
                    artistId={dataEdit?.releaseContributors
                        ?.filter((c) => c.artistRole?.id === featuredRoleId)
                        ?.map((c) => c.artistId)
                        .join(',')}
                />
            </AppFormItem>

            {/* Genre (Full Width) */}
            <AppFormItem
                name="primaryGenreId"
                label={messages('releaseVideo.fields.genre')}
                required
                rules={[
                    {
                        required: true,
                        message: messages('validation.select'),
                    },
                ]}
            >
                <GenresSelect
                    placeholder={messages('releaseVideo.fields.genre')}
                    allowClear
                    onChange={(value) =>
                        onFieldUpdate?.({ primaryGenreId: value })
                    }
                />
            </AppFormItem>

            {/* Language & Explicit Dropdowns */}
            <Row gutter={16}>
                <Col span={12}>
                    <AppFormItem
                        name={['releaseLanguage', 'audioLanguageId']}
                        label={messages('common.language')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <LanguageSelect
                            placeholder={messages('common.select')}
                            allowClear
                            onChange={(value) =>
                                onFieldUpdate?.({
                                    releaseLanguage: {
                                        audioLanguageId: value,
                                    },
                                })
                            }
                        />
                    </AppFormItem>
                </Col>
                <Col span={12}>
                    <AppFormItem
                        name={['video', 'explicit']}
                        label={messages('releaseVideo.fields.isExplicit')}
                    >
                        <Select
                            placeholder={messages('common.select')}
                            options={[
                                { value: false, label: messages('common.no') },
                                { value: true, label: messages('common.yes') },
                            ]}
                            onChange={(value) =>
                                onFieldUpdate?.({
                                    video: {
                                        explicit: value,
                                    },
                                })
                            }
                        />
                    </AppFormItem>
                </Col>
            </Row>

            {/* Contains AI Content & ISRC */}
            <Row gutter={16}>
                <Col span={12}>
                    <AppFormItem
                        name={['video', 'aiContent']}
                        label={messages(
                            'releaseVideo.fields.containsAiContent'
                        )}
                    >
                        <Select
                            placeholder={messages('common.select')}
                            options={[
                                {
                                    value: RELEASE_AI_CONTENT.ALL,
                                    label: messages('common.all'),
                                },
                                {
                                    value: RELEASE_AI_CONTENT.PARTLY,
                                    label: messages('common.partly'),
                                },
                                {
                                    value: RELEASE_AI_CONTENT.NONE,
                                    label: messages('common.none'),
                                },
                                {
                                    value: RELEASE_AI_CONTENT.UNDETERMINED,
                                    label: messages('common.undetermined'),
                                },
                            ]}
                            onChange={(value) =>
                                onFieldUpdate?.({
                                    video: {
                                        aiContent: value,
                                    },
                                })
                            }
                        />
                    </AppFormItem>
                </Col>
                <Col span={12}>
                    <AppFormItem
                        name={['video', 'isrc']}
                        label={messages('releaseVideo.fields.isrc')}
                        rules={[
                            {
                                min: 12,
                                max: 12,
                                message: messages('validation.mustBeLength', {
                                    number: 12,
                                    field: 'ISRC',
                                }),
                            },
                        ]}
                    >
                        <Input
                            placeholder={messages(
                                'releaseVideo.fields.isrcPlaceholder'
                            )}
                            allowClear
                            onBlur={(e) =>
                                onFieldUpdate?.({
                                    video: { isrc: e.target.value },
                                })
                            }
                        />
                    </AppFormItem>
                </Col>
            </Row>

            {/* Ownership Subheader */}
            <div className="mb-4 mt-6 border-b border-gray-100 pb-2 text-base font-bold tracking-wide">
                {messages('common.ownership')}
            </div>

            {/* Content Provider & Repertoire Owner */}
            {/* <Row gutter={16}>
                <Col span={12}>
                    <AppFormItem
                        name={['video', 'contentProvider']}
                        label={messages('releaseVideo.fields.contentProvider')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Select
                            placeholder={messages('common.select')}
                            allowClear
                            onChange={(value) =>
                                onFieldUpdate?.({
                                    video: {
                                        contentProvider: value,
                                    },
                                })
                            }
                            options={[
                                {
                                    value: 'ANT Music LLC',
                                    label: 'ANT Music LLC',
                                },
                            ]}
                        />
                    </AppFormItem>
                </Col>
                <Col span={12}>
                    <AppFormItem
                        name={['video', 'copyrightOwner']}
                        label={messages('releaseVideo.fields.repertoireOwner')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input
                            placeholder={messages(
                                'releaseVideo.fields.repertoireOwner'
                            )}
                            allowClear
                            onBlur={(e) =>
                                onFieldUpdate?.({
                                    video: {
                                        copyrightOwner: e.target.value,
                                    },
                                })
                            }
                        />
                    </AppFormItem>
                </Col>
            </Row> */}

            {/* Label */}
            <Row gutter={24}>
                <Col span={24}>
                    <AppFormItem
                        name={['video', 'label']}
                        label={messages('formFields.labelId')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input
                            placeholder={messages('formFields.labelId')}
                            allowClear
                            onBlur={(e) =>
                                onFieldUpdate?.({
                                    video: {
                                        label: e.target.value,
                                    },
                                })
                            }
                        />
                    </AppFormItem>
                </Col>
            </Row>

            {/* YouTube Subheader */}
            <div className="mb-4 mt-6 border-b border-gray-100 pb-2 text-base font-bold tracking-wide">
                YouTube
            </div>

            <Row gutter={24} align="bottom" className="mb-4">
                <Col span={24}>
                    <AppFormItem
                        name={['video', 'channelId']}
                        label={messages('releaseVideo.fields.channel')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                        className="mb-0"
                    >
                        <ChannelSelect
                            placeholder={messages(
                                'releaseVideo.fields.channel'
                            )}
                            allowClear
                            onChange={(value) =>
                                onFieldUpdate?.({
                                    video: {
                                        channelId: value,
                                    },
                                })
                            }
                            disabled={!isCanEditChannel}
                        />
                    </AppFormItem>
                </Col>
                {/* <Col span={6}>
                    <AppFormItem label={''}>
                        <Button
                            shape="round"
                            onClick={() => setIsManageCollaboratorsOpen(true)}
                            className="w-full font-semibold"
                        >
                            {messages(
                                'releaseVideo.fields.manageCollaborators'
                            )}
                        </Button>
                    </AppFormItem>
                </Col> */}
            </Row>

            {/* Keywords (Full Width) */}
            <AppFormItem
                name={['video', 'keywords']}
                label={
                    <div className="flex items-center gap-2">
                        <span>{messages('common.keyword')}</span>
                        <Tooltip title={messages('common.copy') || 'Copy'}>
                            <Button
                                type="text"
                                size="small"
                                icon={<CopyOutlined />}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const keywords = form.getFieldValue([
                                        'video',
                                        'keywords',
                                    ]);
                                    if (
                                        keywords &&
                                        Array.isArray(keywords) &&
                                        keywords.length > 0
                                    ) {
                                        navigator.clipboard
                                            .writeText(keywords.join(','))
                                            .then(() => {
                                                showNotification(
                                                    'success',
                                                    messages('common.copied')
                                                );
                                            });
                                    }
                                }}
                            />
                        </Tooltip>
                    </div>
                }
            >
                <Select
                    mode="tags"
                    placeholder={messages(
                        'releaseVideo.fields.keywordsPlaceholder'
                    )}
                    allowClear
                    tokenSeparators={[',']}
                    onChange={(value) =>
                        onFieldUpdate?.({
                            video: {
                                keywords: value,
                            },
                        })
                    }
                />
            </AppFormItem>

            {/* Description (Full Width) */}
            <AppFormItem
                name={['video', 'description']}
                label={messages('common.description')}
                rules={[
                    {
                        max: MAX_NOTE_LENGTH,
                        message: messages('validation.stringMax', {
                            max: MAX_NOTE_LENGTH,
                            field: messages('common.description'),
                        }),
                    },
                ]}
            >
                <TextArea
                    showCount
                    placeholder={messages('common.description')}
                    allowClear
                    rows={4}
                    maxLength={MAX_NOTE_LENGTH}
                    className="mb-2"
                    onBlur={(e) =>
                        onFieldUpdate?.({
                            video: { description: e.target.value },
                        })
                    }
                />
            </AppFormItem>

            {/* Is Made For Kids */}
            <AppFormItem
                name={['video', 'madeForKids']}
                label={messages('releaseVideo.fields.isMadeForKids')}
            >
                <Select
                    placeholder={messages('common.select')}
                    allowClear
                    options={[
                        {
                            value: RELEASE_MADE_FOR_KIDS.NO,
                            label: messages('common.no'),
                        },
                        {
                            value: RELEASE_MADE_FOR_KIDS.YES,
                            label: messages('common.yes'),
                        },
                        {
                            value: RELEASE_MADE_FOR_KIDS.CHANNEL_DEFAULT,
                            label: messages(
                                'releaseVideo.fields.channelDefault'
                            ),
                        },
                    ]}
                    onChange={(value) =>
                        onFieldUpdate?.({
                            video: {
                                madeForKids: value,
                            },
                        })
                    }
                />
            </AppFormItem>

            <ManageCollaboratorsModal
                isOpen={isManageCollaboratorsOpen}
                onClose={() => setIsManageCollaboratorsOpen(false)}
            />
        </>
    );
}
