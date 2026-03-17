import AppFormItem from '@/components/ui/antd-form/form-Item';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { Input, Select } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
    isReadMode: boolean;
    isCreateReleasePage: boolean;
};

export default function LegalNoticesSectionV2({
    debouncedUpdate,
    isReadMode,
    isCreateReleasePage,
}: Props) {
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    const messages = useTranslations();

    const cLineYear = watch('cLineYear');
    const cLineOwner = watch('cLineOwner');
    const pLineYear = watch('pLineYear');
    const pLineOwner = watch('pLineOwner');
    const showCLine = !!cLineYear && !!cLineOwner;
    const showPLine = !!pLineYear && !!pLineOwner;

    const copyRightYearList = () => {
        const currentYear = dayjs().year();
        return [
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
    };
    const copyRightYears = copyRightYearList();

    return (
        <div id="legal-notices" className="flex flex-col gap-6">
            <span className="text-base font-semibold">
                {messages('common.legalNotices')}
            </span>
            <div className="grid grid-cols-1 gap-x-16 gap-y-1 md:grid-cols-2 lg:grid-cols-2">
                <AppFormItem
                    label={messages('formFields.cLineYear')}
                    required
                    validateStatus={errors.cLineYear ? 'error' : ''}
                    help={errors.cLineYear?.message as string}
                    tooltipInfo={messages('tooltipForm.cLineYear')}
                >
                    <Controller
                        control={control}
                        name="cLineYear"
                        render={({ field }) => (
                            <Select
                                id="cLineYear"
                                {...field}
                                value={field.value}
                                className="w-full"
                                disabled={isCreateReleasePage || isReadMode}
                                onChange={(newYear) => {
                                    field.onChange(Number(newYear));
                                    debouncedUpdate(
                                        {
                                            cLineYear: Number(newYear),
                                        },
                                        'cLineYear'
                                    );
                                }}
                                options={copyRightYears}
                                status={errors.cLineYear ? 'error' : undefined}
                            />
                        )}
                    />
                </AppFormItem>

                <AppFormItem
                    label={messages('formFields.cLineOwner')}
                    required
                    validateStatus={errors.cLineOwner ? 'error' : ''}
                    help={errors.cLineOwner?.message as string}
                    tooltipInfo={messages('tooltipForm.cLineOwner')}
                >
                    <Controller
                        control={control}
                        name="cLineOwner"
                        render={({ field }) => (
                            <Input
                                id="cLineOwner"
                                {...field}
                                value={field.value ?? ''}
                                disabled={isCreateReleasePage || isReadMode}
                                allowClear
                                onBlur={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    debouncedUpdate(
                                        { cLineOwner: value },
                                        'cLineOwner'
                                    );
                                }}
                                status={errors.cLineOwner ? 'error' : undefined}
                            />
                        )}
                    />
                </AppFormItem>

                <div className="col-span-2 mb-4 flex justify-end">
                    {showCLine && (
                        <div className="col-span-1 text-sm text-gray-600 md:col-span-2 lg:col-span-2">
                            © {cLineYear} {cLineOwner}.{' '}
                            {messages('legal.allRightsReserved')}
                        </div>
                    )}
                </div>

                <AppFormItem
                    label={messages('formFields.pLineYear')}
                    required
                    validateStatus={errors.pLineYear ? 'error' : ''}
                    help={errors.pLineYear?.message as string}
                    tooltipInfo={messages('tooltipForm.pLineYear')}
                >
                    <Controller
                        control={control}
                        name="pLineYear"
                        render={({ field }) => (
                            <Select
                                id="pLineYear"
                                {...field}
                                value={field.value}
                                className="w-full"
                                disabled={isCreateReleasePage || isReadMode}
                                onChange={(newYear) => {
                                    field.onChange(Number(newYear));
                                    debouncedUpdate(
                                        {
                                            pLineYear: Number(newYear),
                                        },
                                        'pLineYear'
                                    );
                                }}
                                options={copyRightYears}
                                status={errors?.pLineYear ? 'error' : undefined}
                            />
                        )}
                    />
                </AppFormItem>

                <AppFormItem
                    label={messages('formFields.pLineOwner')}
                    required
                    validateStatus={errors.pLineOwner ? 'error' : ''}
                    help={errors.pLineOwner?.message as string}
                    tooltipInfo={messages('tooltipForm.pLineOwner')}
                >
                    <Controller
                        control={control}
                        name="pLineOwner"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="pLineOwner"
                                value={field.value ?? ''}
                                disabled={isCreateReleasePage || isReadMode}
                                allowClear
                                onBlur={(e) => {
                                    const newOwner = e.target.value;
                                    field.onChange(newOwner);
                                    debouncedUpdate(
                                        { pLineOwner: newOwner },
                                        'pLineOwner'
                                    );
                                }}
                                status={errors.pLineOwner ? 'error' : undefined}
                            />
                        )}
                    />
                </AppFormItem>

                <div className="col-span-2 mb-4 flex justify-end">
                    {showPLine && (
                        <div className="col-span-1 text-sm text-gray-600 md:col-span-2 lg:col-span-2">
                            ℗ {pLineYear} {pLineOwner}.{' '}
                            {messages('legal.allRightsReserved')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
