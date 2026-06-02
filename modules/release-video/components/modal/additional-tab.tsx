import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import { useGetListSimpleArtistRole } from '@/modules/artist-role/hooks/use-get-list-simple-artist-role';
import { useCreateReleaseContributor } from '@/modules/release-contributor/hooks/use-create-release-contributor';
import { useDeleteReleaseContributor } from '@/modules/release-contributor/hooks/use-delete-release-contributor';
import { ReleasesData } from '@/modules/releases/types';
import { Col, DatePicker, Input, Row } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

interface AdditionalTabProps {
    dataEdit?: ReleasesData;
}

export default function AdditionalTab({ dataEdit }: AdditionalTabProps) {
    const messages = useTranslations();
    const { createReleaseContributor } = useCreateReleaseContributor();
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

    // Handlers for Composer
    const handleSelectComposer = (artistId: string) => {
        if (!dataEdit?.id || !composerRoleId) return;
        createReleaseContributor({
            payload: {
                artistId,
                artistRoleId: composerRoleId,
                releaseId: dataEdit.id,
                addContributorToTracks: false,
            },
        });
    };

    const handleDeselectComposer = (artistId: string) => {
        if (!dataEdit?.id) return;
        const contributor = dataEdit.releaseContributors?.find(
            (c) =>
                c.artistId === artistId && c.artistRole?.id === composerRoleId
        );
        if (contributor?.id) {
            deleteReleaseContributor({
                id: contributor.id,
            });
        }
    };

    // Handlers for Editor
    const handleSelectEditor = (artistId: string) => {
        if (!dataEdit?.id || !editorRoleId) return;
        createReleaseContributor({
            payload: {
                artistId,
                artistRoleId: editorRoleId,
                releaseId: dataEdit.id,
                addContributorToTracks: false,
            },
        });
    };

    const handleDeselectEditor = (artistId: string) => {
        if (!dataEdit?.id) return;
        const contributor = dataEdit.releaseContributors?.find(
            (c) =>
                c.artistId === artistId && c.artistRole?.id === editorRoleId
        );
        if (contributor?.id) {
            deleteReleaseContributor({
                id: contributor.id,
            });
        }
    };

    // Handlers for Producer
    const handleSelectProducer = (artistId: string) => {
        if (!dataEdit?.id || !producerRoleId) return;
        createReleaseContributor({
            payload: {
                artistId,
                artistRoleId: producerRoleId,
                releaseId: dataEdit.id,
                addContributorToTracks: false,
            },
        });
    };

    const handleDeselectProducer = (artistId: string) => {
        if (!dataEdit?.id) return;
        const contributor = dataEdit.releaseContributors?.find(
            (c) =>
                c.artistId === artistId && c.artistRole?.id === producerRoleId
        );
        if (contributor?.id) {
            deleteReleaseContributor({
                id: contributor.id,
            });
        }
    };

    // Handlers for Director
    const handleSelectDirector = (artistId: string) => {
        if (!dataEdit?.id || !directorRoleId) return;
        createReleaseContributor({
            payload: {
                artistId,
                artistRoleId: directorRoleId,
                releaseId: dataEdit.id,
                addContributorToTracks: false,
            },
        });
    };

    const handleDeselectDirector = (artistId: string) => {
        if (!dataEdit?.id) return;
        const contributor = dataEdit.releaseContributors?.find(
            (c) =>
                c.artistId === artistId && c.artistRole?.id === directorRoleId
        );
        if (contributor?.id) {
            deleteReleaseContributor({
                id: contributor.id,
            });
        }
    };

    const maxYear = dayjs().year() + 1;
    const disabledYear = (current: dayjs.Dayjs) => {
        return current && current.year() > maxYear;
    };

    return (
        <div className="mx-auto w-full pb-8 pt-4">
            <Row gutter={16}>
                <Col span={8}>
                    <AppFormItem
                        name="upc"
                        label="UPC"
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
                        <Input placeholder="UPC" allowClear />
                    </AppFormItem>
                </Col>

                <Col span={8}>
                    <AppFormItem name="version" label="Video version">
                        <Input placeholder="Video version" allowClear />
                    </AppFormItem>
                </Col>

                <Col span={8}>
                    <AppFormItem
                        name={['video', 'partnerCustomId1']}
                        label="Partner custom ID 1"
                    >
                        <Input placeholder="Partner custom ID 1" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem
                        name={['video', 'partnerCustomId2']}
                        label="Partner custom ID 2"
                    >
                        <Input placeholder="Partner custom ID 2" allowClear />
                    </AppFormItem>
                </Col>
            </Row>

            <div className="mb-4 mt-6 border-b border-gray-100 pb-2 text-base font-bold text-gray-800">
                Credits
            </div>

            <Row gutter={16}>
                <Col span={8}>
                    <AppFormItem name="composers" label="Composer(s)">
                        <ArtistSelect
                            mode="multiple"
                            placeholder={messages('artist.select')}
                            onSelect={handleSelectComposer}
                            onDeselect={handleDeselectComposer}
                        />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="editors" label="Editor(s)">
                        <ArtistSelect
                            mode="multiple"
                            placeholder={messages('artist.select')}
                            onSelect={handleSelectEditor}
                            onDeselect={handleDeselectEditor}
                        />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="producers" label="Producer(s)">
                        <ArtistSelect
                            mode="multiple"
                            placeholder={messages('artist.select')}
                            onSelect={handleSelectProducer}
                            onDeselect={handleDeselectProducer}
                        />
                    </AppFormItem>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <AppFormItem name="directors" label="Director(s)">
                        <ArtistSelect
                            mode="multiple"
                            placeholder={messages('artist.select')}
                            onSelect={handleSelectDirector}
                            onDeselect={handleDeselectDirector}
                        />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="cLineOwner" label="Copyright">
                        <Input placeholder="Copyright" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem
                        name="cLineYear"
                        label="Copyright year"
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
                            placeholder="Copyright year"
                            className="w-full"
                            allowClear
                            disabledDate={disabledYear}
                        />
                    </AppFormItem>
                </Col>
            </Row>
        </div>
    );
}
