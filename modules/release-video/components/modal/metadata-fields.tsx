import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import GenresSelect from '@/components/ui/select/genres-select';
import LabelSelect from '@/components/ui/select/label-select';
import LanguageSelect from '@/components/ui/select/language-select';
import { MAX_NAME_LENGTH, MAX_NOTE_LENGTH } from '@/constants/validate';
import { useGetListSimpleArtistRole } from '@/modules/artist-role/hooks/use-get-list-simple-artist-role';
import ChannelSelect from '@/modules/channels/components/select/channel-select';
import { useCreateReleaseArtist } from '@/modules/release-artist/hooks/use-create-release-artist';
import { useDeleteReleaseArtist } from '@/modules/release-artist/hooks/use-delete-release-artist';
import { useCreateReleaseContributor } from '@/modules/release-contributor/hooks/use-create-release-contributor';
import { useDeleteReleaseContributor } from '@/modules/release-contributor/hooks/use-delete-release-contributor';
import {
    RELEASE_AI_CONTENT,
    RELEASE_MADE_FOR_KIDS,
} from '@/modules/releases/enums';
import { ReleasesData } from '@/modules/releases/types';
import { Button, Col, FormInstance, Input, Row, Select } from 'antd';
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
    const [isManageCollaboratorsOpen, setIsManageCollaboratorsOpen] =
        useState(false);
    const { createReleaseArtist } = useCreateReleaseArtist();
    const { deleteReleaseArtist } = useDeleteReleaseArtist();
    const { createReleaseContributor } = useCreateReleaseContributor();
    const { deleteReleaseContributor } = useDeleteReleaseContributor();
    const { artistsRolesData } = useGetListSimpleArtistRole();

    const featuredRole = artistsRolesData?.find((r) =>
        r.name?.toLowerCase().includes('featured')
    );
    const featuredRoleId = featuredRole?.id;

    const handleSelect = (artistId: string) => {
        if (!dataEdit?.id) return;
        createReleaseArtist({
            payload: {
                artistId,
                releaseId: dataEdit.id,
                addArtistToTracks: false,
            },
        });
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

    const handleSelectFeatured = (artistId: string) => {
        if (!dataEdit?.id || !featuredRoleId) return;
        createReleaseContributor({
            payload: {
                artistId,
                artistRoleId: featuredRoleId,
                releaseId: dataEdit.id,
                addContributorToTracks: false,
            },
        });
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
                        max: MAX_NAME_LENGTH,
                        message: messages('validation.stringMax', {
                            max: MAX_NAME_LENGTH,
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
                    maxLength={MAX_NAME_LENGTH}
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
                    onSelect={handleSelect}
                    onDeselect={handleDeselect}
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
                    onSelect={handleSelectFeatured}
                    onDeselect={handleDeselectFeatured}
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
                            onBlur={() =>
                                onFieldUpdate?.({
                                    video: form.getFieldValue('video'),
                                })
                            }
                        />
                    </AppFormItem>
                </Col>
            </Row>

            {/* Ownership Subheader */}
            <div className="mb-4 mt-6 border-b border-gray-100 pb-2 text-base font-bold tracking-wide text-gray-800">
                {messages('common.ownership')}
            </div>

            {/* Content Provider & Repertoire Owner */}
            <Row gutter={16}>
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
                        <LabelSelect
                            placeholder={messages('common.select')}
                            allowClear
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
                            onBlur={() =>
                                onFieldUpdate?.({
                                    video: form.getFieldValue('video'),
                                })
                            }
                        />
                    </AppFormItem>
                </Col>
            </Row>

            {/* Label */}
            <Row gutter={16}>
                <Col span={24}>
                    <AppFormItem
                        name="labelId"
                        label={messages('formFields.labelId')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <LabelSelect
                            placeholder={messages('common.select')}
                            allowClear
                        />
                    </AppFormItem>
                </Col>
            </Row>

            {/* YouTube Subheader */}
            <div className="mb-4 mt-6 border-b border-gray-100 pb-2 text-base font-bold tracking-wide text-gray-800">
                YouTube
            </div>

            <Row gutter={16} align="bottom" className="mb-4">
                <Col span={18}>
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
                        />
                    </AppFormItem>
                </Col>
                <Col span={6}>
                    <AppFormItem label={''}>
                        <Button
                            shape="round"
                            onClick={() => setIsManageCollaboratorsOpen(true)}
                            className="font-semibold"
                        >
                            {messages('releaseVideo.fields.manageCollaborators')}
                        </Button>
                    </AppFormItem>
                </Col>
            </Row>

            {/* Keywords (Full Width) */}
            <AppFormItem
                name={['video', 'keywords']}
                label={messages('common.keyword')}
            >
                <Select
                    mode="tags"
                    placeholder={messages(
                        'releaseVideo.fields.keywordsPlaceholder'
                    )}
                    allowClear
                    tokenSeparators={[',']}
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
                <Input.TextArea
                    showCount
                    placeholder={messages('common.description')}
                    allowClear
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    maxLength={MAX_NOTE_LENGTH}
                    className="mb-2"
                    onBlur={() =>
                        onFieldUpdate?.({
                            video: form.getFieldValue('video'),
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
                    onBlur={() =>
                        onFieldUpdate?.({
                            video: form.getFieldValue('video'),
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
