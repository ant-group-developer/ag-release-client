import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { TrackData } from '@/modules/tracks/types';
import { ConfigProvider, Typography } from 'antd';
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
    // const openModal = useModalStore((state) => state.openModal);
    const releaseAction = useReleaseActionStore((s) => s.action);

    // const form = Form.useFormInstance();
    // router
    // const params = useParams();
    // const router = useRouter();

    // const isAddArtistsFromRelease = useWatch('copyArtistsFromRelease', form);
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    // const updateTrackDraft = async (data: any, fieldName?: string) => {
    //     if (fieldName) {
    //         try {
    //             await form.validateFields([fieldName]);
    //         } catch {
    //             return;
    //         }
    //     }
    //     debouncedUpdateTrackDraft(data);
    // };

    return (
        <ConfigProvider
            componentDisabled={isReadMode}
            form={{ variant: isReadMode ? 'underlined' : 'outlined' }}
        >
            <div className="space-y-4">
                <p className="text-base font-semibold">
                    {messages('common.contributors')}
                </p>
                <div id={`tracks.${index}.trackContributors`}>
                    <TrackContributorsTable
                        dataSource={trackData?.trackContributors}
                        trackData={trackData}
                    />
                </div>
            </div>
        </ConfigProvider>
    );
}
