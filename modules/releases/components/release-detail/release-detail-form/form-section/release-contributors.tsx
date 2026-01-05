import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useFormContext } from 'react-hook-form';
import ReleaseContributorsTable from '../../../table/release-contributors-table';
type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
    isReadMode: boolean;
};

export default function ReleaseContributorsSection({
    isReadMode,
    debouncedUpdate,
}: Props) {
    // hook - state
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const messages = useTranslations();
    // const openModal = useModalStore((state) => state.openModal);
    // const { action } = useGetReleaseDetailRoute();

    // router - params
    const params = useParams();
    // const isReadMode = useMemo(
    //     () => action !== RELEASE_DETAIL_ACTION.EDIT,
    //     [action]
    // );

    // variables
    const isCreateReleasePage = params['action'] === 'create';
    const isVariousArtist = watch('isVariousArtist');
    const releaseArtist = formValues.releaseArtists || [];

    // func

    return (
        <CollapseItem
            defaultActiveKey={['Release Contributors']}
            items={[
                {
                    key: 'Release Contributors',
                    label: (
                        <span className="text-base font-semibold">
                            {messages('release.contributors')}
                        </span>
                    ),
                    children: (
                        <div className="" id="releaseContributors">
                            <ReleaseContributorsTable
                                dataSource={releaseArtist}
                                disabled={isReadMode}
                            />
                        </div>
                    ),
                },
            ]}
        />
    );
}
