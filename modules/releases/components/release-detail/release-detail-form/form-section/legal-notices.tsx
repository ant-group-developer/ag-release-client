import FormItem from '@/components/ui/react-hook-form/form-item';
import useModalStore from '@/hooks/use-modal';
import { useUpdateReleaseArtist } from '@/modules/release-artist/hooks/use-update-release-artist';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { UpdateReleaseArtistPayload } from '@/modules/release-artist/types/payload';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { UpdateVariables } from '@/types/api';
import { Input, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
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

    // router
    const params = useParams();

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
                value: (currentYear - 1).toString(),
            },
            { label: currentYear.toString(), value: currentYear.toString() },
            {
                label: (currentYear + 1).toString(),
                value: (currentYear + 1).toString(),
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
                        <Title level={4} className="!mb-0">
                            {messages('common.legalNotices')}
                        </Title>
                    ),
                    children: (
                        <div className="grid grid-cols-4 items-center gap-5">
                            {/* C-Line Year */}
                            <FormItem
                                name="cLineOwner"
                                label={messages('formFields.cLineYear')}
                                required
                                ErrorMessage={''}
                                tooltipInfor={messages('tooltipForm.cLineYear')}
                            >
                                <Controller
                                    control={control}
                                    name="cLineOwner"
                                    render={({ field }) => {
                                        const [year, owner] =
                                            field.value?.split(' ') || ['', ''];
                                        return (
                                            <Select
                                                className="w-full"
                                                value={year}
                                                disabled={isCreateReleasePage}
                                                onChange={(newYear) => {
                                                    const v = owner?.trim()
                                                        ? `${newYear} ${owner.trim()}`
                                                        : newYear;
                                                    field.onChange(v);
                                                    debouncedUpdate({
                                                        cLineOwner: v,
                                                    });
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
                                        const [year, owner] =
                                            field.value?.split(' ') || ['', ''];
                                        return (
                                            <Input
                                                id="cLineOwner"
                                                value={owner}
                                                disabled={isCreateReleasePage}
                                                allowClear
                                                onChange={(e) => {
                                                    const newOwner =
                                                        e.target.value;
                                                    // Nếu owner rỗng, chỉ lưu year, nếu có owner thì format "year owner"
                                                    const v = newOwner?.trim()
                                                        ? `${year} ${newOwner.trim()}`
                                                        : year;
                                                    field.onChange(v);
                                                    debouncedUpdate(
                                                        { cLineOwner: v },
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
                                name="pLineOwner"
                                label={messages('formFields.pLineYear')}
                                required
                                ErrorMessage={''}
                                tooltipInfor={messages('tooltipForm.pLineYear')}
                            >
                                <Controller
                                    control={control}
                                    name="pLineOwner"
                                    render={({ field }) => {
                                        const [year, owner] =
                                            field.value?.split(' ') || ['', ''];
                                        return (
                                            <Select
                                                className="w-full"
                                                value={year}
                                                disabled={isCreateReleasePage}
                                                onChange={(newYear) => {
                                                    const v = owner?.trim()
                                                        ? `${newYear} ${owner.trim()}`
                                                        : newYear;
                                                    field.onChange(v);
                                                    debouncedUpdate({
                                                        pLineOwner: v,
                                                    });
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
                                        const [year, owner] =
                                            field.value?.split(' ') || ['', ''];
                                        return (
                                            <Input
                                                id="pLineOwner"
                                                value={owner}
                                                disabled={isCreateReleasePage}
                                                allowClear
                                                onChange={(e) => {
                                                    const newOwner =
                                                        e.target.value;
                                                    // Nếu owner rỗng, chỉ lưu year, nếu có owner thì format "year owner"
                                                    const v = newOwner?.trim()
                                                        ? `${year} ${newOwner.trim()}`
                                                        : year;
                                                    field.onChange(v);
                                                    debouncedUpdate(
                                                        { pLineOwner: v },
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
