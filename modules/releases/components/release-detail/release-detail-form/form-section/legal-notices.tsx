import FormItem from '@/components/ui/react-hook-form/form-item';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import useModalStore from '@/hooks/use-modal';
import { useUpdateReleaseArtist } from '@/modules/release-artist/hooks/use-update-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { UpdateReleaseArtistPayload } from '@/modules/release-artist/types/payload';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseDetailActionStore } from '@/modules/releases/hooks/use-release-action-store';
import { UpdateVariables } from '@/types/api';
import { Input, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ReleaseDetailSchema } from '..';
type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
};
export default function LegalNoticesSection({ debouncedUpdate }: Props) {
    // hook - state
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updateReleaseArtist } = useUpdateReleaseArtist();
    const releaseDetailAction = useReleaseDetailActionStore(
        (state) => state.action
    );

    // router - params
    const params = useParams();
    const isReadMode = useMemo(
        () => releaseDetailAction !== RELEASE_DETAIL_ACTION.EDIT,
        [releaseDetailAction]
    );

    // variables
    const isCreateReleasePage = params['action'] === 'create';

    // func
    const handleApplyAllTracks = (
        releaseArtist: ReleaseArtist,
        isAddArtistToTracks: boolean
    ) => {
        const variables: UpdateVariables<
            ReleaseArtist['id'],
            UpdateReleaseArtistPayload
        > = {
            id: releaseArtist.id,
            payload: {
                addArtistToTracks: isAddArtistToTracks,
            },
        };
        updateReleaseArtist(variables);
    };

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
                        <Title level={5} className="!mb-0">
                            {messages('common.legalNotices')}
                        </Title>
                    ),
                    children: (
                        <div className="grid grid-cols-4 items-center gap-5">
                            {/* C-Line Year */}
                            <FormItem
                                name="cLineYear"
                                label={messages('formFields.cLineYear')}
                                required
                                ErrorMessage={''}
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
                                                onChange={(e) => {
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
                                ErrorMessage={''}
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
                                                onChange={(e) => {
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
                        </div>
                    ),
                },
            ]}
        />
    );
}
