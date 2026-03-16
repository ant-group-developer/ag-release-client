import AppFormItem from '@/components/ui/antd-form/form-Item';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { TrackData } from '@/modules/tracks/types';
import { ConfigProvider, Form, Input, Switch, Typography } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import TrackArtistTable from '../../table/track-artist-table';
const { Title } = Typography;

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any) => void;
    trackData: TrackData;
};

export default function TrackAndArtistSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    // hook - state
    const messages = useTranslations();
    // const openModal = useModalStore((state) => state.openModal);
    const releaseAction = useReleaseActionStore((s) => s.action);

    const form = Form.useFormInstance();
    // router
    // const params = useParams();
    // const router = useRouter();

    // const
    const isAddArtistsFromRelease = useWatch('copyArtistsFromRelease', form);
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    const updateTrackDraft = async (data: any, fieldName?: string) => {
        if (fieldName) {
            try {
                await form.validateFields([fieldName]);
            } catch {
                return;
            }
        }
        debouncedUpdateTrackDraft(data);
    };

    return (
        <ConfigProvider
            componentDisabled={isReadMode}
            form={{ variant: isReadMode ? 'underlined' : 'outlined' }}
        >
            <CollapseItem
                defaultActiveKey={['track-and-artist']}
                items={[
                    {
                        key: 'track-and-artist',
                        label: (
                            <span className="text-base font-semibold">
                                {messages('track.label')} &{' '}
                                {messages('artist.artists')}
                            </span>
                        ),
                        children: (
                            <div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <div className="col-span-2">
                                        <AppFormItem
                                            label={messages('track.name')}
                                            required
                                            name="title"
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        messages(
                                                            'validation.input'
                                                        ),
                                                },
                                            ]}
                                        >
                                            <Input
                                                id={`tracks.${index}.title`}
                                                allowClear
                                                onBlur={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    updateTrackDraft(
                                                        {
                                                            title: value,
                                                        },
                                                        'title'
                                                    );
                                                }}
                                            />
                                        </AppFormItem>
                                    </div>
                                    <div className="col-span-2">
                                        <AppFormItem
                                            label={messages('release.version')}
                                            name="version"
                                        >
                                            <Input
                                                id={`tracks.${index}.version`}
                                                allowClear
                                                onBlur={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    updateTrackDraft(
                                                        {
                                                            version: value,
                                                        },
                                                        'version'
                                                    );
                                                }}
                                            />
                                        </AppFormItem>
                                    </div>
                                    <div className="col-span-4 space-y-4">
                                        <AppFormItem
                                            label={`${messages('track.addAllArtistFromRelease')} ?`}
                                            name="copyArtistsFromRelease"
                                            className="!mb-0"
                                        >
                                            <Switch
                                                onChange={(e) => {
                                                    debouncedUpdateTrackDraft({
                                                        copyArtistsFromRelease:
                                                            e,
                                                    });
                                                }}
                                            />
                                        </AppFormItem>

                                        {!isAddArtistsFromRelease && (
                                            <div
                                                id={`tracks.${index}.trackArtists`}
                                            >
                                                <TrackArtistTable
                                                    dataSource={
                                                        trackData?.trackArtists
                                                    }
                                                    trackData={trackData}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
        </ConfigProvider>
    );
}
