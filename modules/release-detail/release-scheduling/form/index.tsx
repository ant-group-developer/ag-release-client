import { LabelForm } from '@/components/ui/label/labelForm';
import RegionSelect from '@/components/ui/select/region-select';
import TimezoneSelect from '@/components/ui/select/timezone-select';
import ErrorText from '@/components/ui/text/error-text';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const releaseSchedulingSchema = (messages: any) =>
    z.object({
        releaseDate: z.string().nonempty(messages('validation.input')),
        territoryType: z
            .array(z.string())
            .min(1, messages('validation.select')),
        timezone: z.string().nonempty(messages('validation.input')),
    });

export type ReleaseSchedulingSchema = z.infer<
    ReturnType<typeof releaseSchedulingSchema>
>;

type Props = {};

export default function ReleaseSchedulingForm({}: Props) {
    const messages = useTranslations();

    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const formMethods = useForm<ReleaseSchedulingSchema>({
        defaultValues: {
            releaseDate: formValues?.releaseDate || '',
            territoryType: formValues?.territory || [],
            timezone: formValues?.timezone || '',
        },
        resolver: zodResolver(releaseSchedulingSchema(messages)),
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const {
        control,
        formState: { errors },
        watch,
        trigger,
    } = formMethods;

    const watchedAllFields = useWatch({ control });

    useEffect(() => {
        const updatedFormValues = {
            ...formValues,
            releaseDate: watchedAllFields.releaseDate,
            territoryType: watchedAllFields.territoryType,
            timezone: watchedAllFields.timezone,
        };

        setFormValues(updatedFormValues);
    }, [watchedAllFields]);

    useEffect(() => {
        trigger();
    }, []);

    return (
        <div className="rounded-lg bg-white p-4">
            <FormProvider {...formMethods}>
                <form className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-8">
                        <div>
                            <LabelForm
                                htmlFor="releaseDate"
                                required
                                label="Thời gian phát hành"
                            />
                            <Controller
                                control={control}
                                name="releaseDate"
                                render={({ field }) => (
                                    <DatePicker
                                        id="releaseDate"
                                        className="w-full"
                                        format="DD/MM/YYYY"
                                        value={
                                            field.value
                                                ? dayjs(
                                                      field.value,
                                                      'DD/MM/YYYY'
                                                  )
                                                : null
                                        }
                                        onChange={(date) => {
                                            const formattedDate = date
                                                ? dayjs(date).format(
                                                      'DD/MM/YYYY'
                                                  )
                                                : '';
                                            field.onChange(formattedDate);
                                        }}
                                        status={
                                            errors.releaseDate
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                            <ErrorText
                                isError={!!errors.releaseDate}
                                message={errors.releaseDate?.message}
                            />
                        </div>

                        <div>
                            <LabelForm
                                htmlFor="timezone"
                                required
                                label="timezone"
                            />
                            <Controller
                                control={control}
                                name="timezone"
                                render={({ field }) => (
                                    <TimezoneSelect
                                        id="timezone"
                                        className="w-full"
                                        {...field}
                                        status={
                                            errors.timezone
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                            <ErrorText
                                isError={!!errors.timezone}
                                message={errors.timezone?.message}
                            />
                        </div>

                        <div>
                            <LabelForm
                                htmlFor="territoryType"
                                required
                                label="Khu vực"
                            />
                            <Controller
                                control={control}
                                name="territoryType"
                                render={({ field }) => (
                                    <RegionSelect
                                        className="w-full"
                                        id="territoryType"
                                        multiple
                                        allowClear
                                        maxTagCount="responsive"
                                        maxTagPlaceholder={(value) => (
                                            <CustomTooltip
                                                title={value
                                                    .map(
                                                        (item: any) =>
                                                            item.label
                                                    )
                                                    .join(', ')}
                                            >
                                                +{value.length}
                                            </CustomTooltip>
                                        )}
                                        {...field}
                                        status={
                                            errors.territoryType
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                            <ErrorText
                                isError={!!errors.territoryType}
                                message={errors.territoryType?.message}
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
