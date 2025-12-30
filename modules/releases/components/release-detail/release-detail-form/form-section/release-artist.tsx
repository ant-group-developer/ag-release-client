import FormItem from '@/components/ui/react-hook-form/form-item';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';
import ReleaseArtistTable from '../../../table/release-artist-table';
type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
    isReadMode: boolean;
};

export default function ReleaseArtistSection({
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
            defaultActiveKey={['Release Artists']}
            items={[
                {
                    key: 'Release Artists',
                    label: (
                        <span className="text-base font-semibold">
                            {' '}
                            {messages('releaseArtist.label')}{' '}
                        </span>
                    ),
                    children: (
                        <div className="grid grid-cols-3 items-center gap-4">
                            <div className="col-span-3">
                                <FormItem
                                    name="isVariousArtist"
                                    label={messages(
                                        'release.isMoreThan4Artists'
                                    )}
                                    required
                                    ErrorMessage={''}
                                    tooltipInfor={messages(
                                        'tooltipForm.isMoreThan4Artists'
                                    )}
                                >
                                    <Controller
                                        control={control}
                                        name="isVariousArtist"
                                        render={({
                                            field: { ref, ...field },
                                        }) => (
                                            <div className="pt-1">
                                                <Radio.Group
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdate({
                                                            isVariousArtist:
                                                                value,
                                                        });
                                                    }}
                                                    disabled={
                                                        isCreateReleasePage ||
                                                        isReadMode
                                                    }
                                                >
                                                    <Radio value={false}>
                                                        {messages('common.no')}
                                                    </Radio>
                                                    <Radio value={true}>
                                                        {messages('common.yes')}{' '}
                                                        {` (${messages('artist.descriptionVariantArtists')})`}
                                                    </Radio>
                                                </Radio.Group>
                                            </div>
                                        )}
                                    />
                                </FormItem>
                            </div>

                            {!isVariousArtist && (
                                <div className="col-span-4" id="releaseArtists">
                                    <ReleaseArtistTable
                                        dataSource={releaseArtist}
                                        disabled={isReadMode}
                                    />
                                </div>
                            )}
                        </div>
                    ),
                },
            ]}
        />
    );
}
