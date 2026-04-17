import AppFormItem from '@/components/ui/antd-form/form-Item';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { DatePicker, Input } from 'antd';
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
        getValues,
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

    const maxYear = dayjs().year() + 1;
    const disabledYear = (current: dayjs.Dayjs) => {
        return current && current.year() > maxYear;
    };

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
                            <DatePicker
                                id="cLineYear"
                                picker="year"
                                value={
                                    field.value
                                        ? dayjs().year(field.value)
                                        : null
                                }
                                className="w-full"
                                disabled={isCreateReleasePage || isReadMode}
                                onChange={(date) => {
                                    const value = date
                                        ? date.year()
                                        : undefined;
                                    field.onChange(value);
                                    debouncedUpdate(
                                        {
                                            cLineYear: value,
                                        },
                                        'cLineYear'
                                    );
                                }}
                                disabledDate={disabledYear}
                                status={errors.cLineYear ? 'error' : undefined}
                                allowClear
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
                                onBlur={(e) => {
                                    const value = e.target.value || null;
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
                            <DatePicker
                                id="pLineYear"
                                picker="year"
                                value={
                                    field.value
                                        ? dayjs().year(field.value)
                                        : null
                                }
                                className="w-full"
                                disabled={isCreateReleasePage || isReadMode}
                                onChange={(date) => {
                                    const value = date
                                        ? date.year()
                                        : undefined;
                                    field.onChange(value);
                                    debouncedUpdate(
                                        {
                                            pLineYear: value,
                                        },
                                        'pLineYear'
                                    );
                                }}
                                disabledDate={disabledYear}
                                status={errors?.pLineYear ? 'error' : undefined}
                                allowClear
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
                                onBlur={(e) => {
                                    const newOwner = e.target.value || null;
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
