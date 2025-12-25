import FormItem from '@/components/ui/react-hook-form/form-item';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';
type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
    isReadMode: boolean;
};
export default function LegalNoticesSection({
    isReadMode,
    debouncedUpdate,
}: Props) {
    // hook - state
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    // const formValues = useReleaseFormStore((state) => state.formValues);
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { action } = useGetReleaseDetailRoute();
    const cLineYear = watch('cLineYear');
    const cLineOwner = watch('cLineOwner');
    const pLineYear = watch('pLineYear');
    const pLineOwner = watch('pLineOwner');
    const showCLine = !!cLineYear && !!cLineOwner;
    const showPLine = !!pLineYear && !!pLineOwner;

    // router - params
    const params = useParams();
    // const isReadMode = useMemo(
    //     () => action !== RELEASE_DETAIL_ACTION.EDIT,
    //     [action]
    // );

    // variables
    const isCreateReleasePage = params['action'] === 'create';

    // func
    // const handleApplyAllTracks = (
    //     releaseArtist: ReleaseArtist,
    //     isAddArtistToTracks: boolean
    // ) => {
    //     const variables: UpdateVariables<
    //         ReleaseArtist['id'],
    //         UpdateReleaseArtistPayload
    //     > = {
    //         id: releaseArtist.id,
    //         payload: {
    //             addArtistToTracks: isAddArtistToTracks,
    //         },
    //     };
    //     updateReleaseArtist(variables);
    // };

    const copyRightYearList = () => {
        const currentYear = dayjs().year();
        const yearList = [
            {
                label: (currentYear - 1).toString(),
                value: Number(currentYear - 1),
            },
            { label: currentYear.toString(), value: Number(currentYear) },
            {
                label: (currentYear + 1).toString(),
                value: Number(currentYear + 1),
            },
        ];
        return yearList;
    };
    const copyRightYears = copyRightYearList();

    return (
        <CollapseItem
            defaultActiveKey={['Legal Notices']}
            items={[
                {
                    key: 'Legal Notices',
                    label: (
                        <span className="text-base font-semibold">
                            {messages('common.legalNotices')}
                        </span>
                    ),
                    children: (
                        <div className="grid grid-cols-4 items-center gap-5">
                            {/* C-Line Year */}
                            <FormItem
                                name="cLineYear"
                                label={messages('formFields.cLineYear')}
                                required
                                ErrorMessage={errors.cLineYear?.message}
                                tooltipInfor={messages('tooltipForm.cLineYear')}
                            >
                                <Controller
                                    control={control}
                                    name="cLineYear"
                                    render={({ field }) => {
                                        return (
                                            <Select
                                                id="cLineYear"
                                                {...field}
                                                value={field.value}
                                                className="w-full"
                                                disabled={
                                                    isCreateReleasePage ||
                                                    isReadMode
                                                }
                                                onChange={(newYear) => {
                                                    field.onChange(
                                                        Number(newYear)
                                                    );
                                                    debouncedUpdate(
                                                        {
                                                            cLineYear:
                                                                Number(newYear),
                                                        },
                                                        'cLineYear'
                                                    );
                                                }}
                                                options={copyRightYears}
                                                status={
                                                    errors.cLineYear
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        );
                                    }}
                                />
                            </FormItem>
                            {/* C-Line Owner */}
                            <FormItem
                                name="cLineOwner"
                                label={messages('formFields.cLineOwner')}
                                required
                                ErrorMessage={errors.cLineOwner?.message}
                                tooltipInfor={messages(
                                    'tooltipForm.cLineOwner'
                                )}
                            >
                                <Controller
                                    control={control}
                                    name="cLineOwner"
                                    render={({ field }) => {
                                        return (
                                            <Input
                                                id="cLineOwner"
                                                {...field}
                                                value={field.value ?? ''}
                                                disabled={
                                                    isCreateReleasePage ||
                                                    isReadMode
                                                }
                                                allowClear
                                                onBlur={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    field.onChange(value);
                                                    debouncedUpdate(
                                                        { cLineOwner: value },
                                                        'cLineOwner'
                                                    );
                                                }}
                                                status={
                                                    errors.cLineOwner
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        );
                                    }}
                                />
                            </FormItem>
                            {/* P-Line Year */}
                            <FormItem
                                name="pLineYear"
                                label={messages('formFields.pLineYear')}
                                required
                                ErrorMessage={errors.pLineYear?.message}
                                tooltipInfor={messages('tooltipForm.pLineYear')}
                            >
                                <Controller
                                    control={control}
                                    name="pLineYear"
                                    render={({ field }) => {
                                        return (
                                            <Select
                                                id="pLineYear"
                                                {...field}
                                                value={field.value}
                                                className="w-full"
                                                disabled={
                                                    isCreateReleasePage ||
                                                    isReadMode
                                                }
                                                onChange={(newYear) => {
                                                    field.onChange(
                                                        Number(newYear)
                                                    );
                                                    debouncedUpdate(
                                                        {
                                                            pLineYear:
                                                                Number(newYear),
                                                        },
                                                        'pLineYear'
                                                    );
                                                }}
                                                options={copyRightYears}
                                                status={
                                                    errors?.pLineYear
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        );
                                    }}
                                />
                            </FormItem>
                            {/* P-Line Owner */}
                            <FormItem
                                name="pLineOwner"
                                label={messages('formFields.pLineOwner')}
                                required
                                ErrorMessage={errors.pLineOwner?.message}
                                tooltipInfor={messages(
                                    'tooltipForm.pLineOwner'
                                )}
                            >
                                <Controller
                                    control={control}
                                    name="pLineOwner"
                                    render={({ field }) => {
                                        return (
                                            <Input
                                                {...field}
                                                id="pLineOwner"
                                                value={field.value ?? ''}
                                                disabled={
                                                    isCreateReleasePage ||
                                                    isReadMode
                                                }
                                                allowClear
                                                onBlur={(e) => {
                                                    const newOwner =
                                                        e.target.value;
                                                    field.onChange(newOwner);
                                                    debouncedUpdate(
                                                        {
                                                            pLineOwner:
                                                                newOwner,
                                                        },
                                                        'pLineOwner'
                                                    );
                                                }}
                                                status={
                                                    errors.pLineOwner
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        );
                                    }}
                                />
                            </FormItem>
                            {(showCLine || showPLine) && (
                                <>
                                    <div className="col-span-2">
                                        {showCLine && (
                                            <span>
                                                © {cLineYear} {cLineOwner}.{' '}
                                                {messages(
                                                    'legal.allRightsReserved'
                                                )}
                                            </span>
                                        )}
                                    </div>
                                    <div className="col-span-2">
                                        {showPLine && (
                                            <span>
                                                ℗ {pLineYear} {pLineOwner}.{' '}
                                                {messages(
                                                    'legal.allRightsReserved'
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ),
                },
            ]}
        />
    );
}
