import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { TrackData } from '@/modules/tracks/types';
import { ConfigProvider, Form, Typography } from 'antd';
import { useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import TrackContributorsTable from '../../table/track-contributors-table';
const { Title } = Typography;

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any) => void;
    trackData: TrackData;
};

export default function TrackContributorsSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    // hook - state
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const releaseAction = useReleaseActionStore((s) => s.action);

    const form = Form.useFormInstance();
    // router
    // const params = useParams();
    // const router = useRouter();

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
        <ConfigProvider componentDisabled={isReadMode}>
            <CollapseItem
                defaultActiveKey={['track-and-artist']}
                items={[
                    {
                        key: 'track-and-artist',
                        label: (
                            <span className="text-base font-semibold">
                                {messages('common.contributors')}
                            </span>
                        ),
                        children: (
                            <div id={`tracks.${index}.trackArtists`}>
                                <TrackContributorsTable
                                    dataSource={trackData?.trackArtists}
                                    trackData={trackData}
                                />
                            </div>
                        ),
                    },
                ]}
            />
        </ConfigProvider>
    );
}
