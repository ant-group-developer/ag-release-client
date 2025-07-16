import FormItem from '@/components/ui/react-hook-form/form-item';
import RegionSelect from '@/components/ui/select/region-select';
import TimezoneSelect from '@/components/ui/select/timezone-select';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT } from '@/enums/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { UpdateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const releaseSchedulingSchema = (messages: any) =>
    z.object({
        releaseDate: z.string().nonempty(messages('validation.input')),
        releaseTime: z.string().nonempty(messages('validation.input')),
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
    const { updateReleaseDraft } = useUpdateReleaseDraft();

    const formMethods = useForm<ReleaseSchedulingSchema>({
        defaultValues: {
            releaseDate: formValues?.releaseDate ?? '',
            releaseTime: formValues?.releaseTime,
            // territoryType: formValues?.territoryType || [],
            timezone: formValues?.releaseTimezoneId ?? '',
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
        setValue,
    } = formMethods;

    const debouncedUpdate = useCallback(
        debounce((data) => {
            if (!formValues.id) return;
            const variables: UpdateVariables<
                ReleasesData['id'],
                UpdateReleaseDraftPayload
            > = {
                id: formValues.id ?? '',
                payload: data,
                onSuccess: (data: ReleasesData) => {
                    setFormValues(data);
                },
            };
            updateReleaseDraft(variables);
        }, 500),
        [formValues.id]
    );

    // const watchedAllFields = useWatch({ control });

    // useEffect(() => {
    //     const updatedFormValues = {
    //         ...formValues,
    //         releaseDate: watchedAllFields.releaseDate,
    //         territoryType: watchedAllFields.territoryType,
    //         timezone: watchedAllFields.timezone,
    //     };

    //     setFormValues(updatedFormValues);
    // }, [watchedAllFields]);

    // useEffect(() => {
    //     trigger();
    // }, []);

    return (
        <div className="rounded-lg bg-white p-4">
            <FormProvider {...formMethods}>
                <form className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <FormItem
                            name="releaseDate"
                            label={messages('releases.releaseDate')}
                            required
                            ErrorMessage={errors.releaseDate?.message}
                        >
                            <Controller
                                control={control}
                                name="releaseDate"
                                render={({ field }) => (
                                    <DatePicker
                                        id="releaseDate"
                                        className="w-full"
                                        format={DATE_FORMAT.DATE_ONLY}
                                        disabledDate={(date) =>
                                            date &&
                                            date < dayjs().startOf('day')
                                        }
                                        value={
                                            field.value
                                                ? dayjs(
                                                      field.value,
                                                      'YYYY-MM-DD'
                                                  )
                                                : null
                                        }
                                        onChange={(date) => {
                                            field.onChange(
                                                date
                                                    ? date.format('YYYY-MM-DD')
                                                    : ''
                                            );
                                            debouncedUpdate({
                                                releaseDate: date,
                                            });
                                        }}
                                        status={
                                            errors.releaseDate
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="releaseTime"
                            label={messages('common.releaseTime')}
                            required
                            ErrorMessage={errors.releaseTime?.message}
                        >
                            <Controller
                                control={control}
                                name="releaseTime"
                                render={({ field }) => (
                                    <TimePicker
                                        className="w-full"
                                        value={
                                            field.value
                                                ? dayjs(field.value, 'HH:mm')
                                                : null
                                        }
                                        onChange={(time) => {
                                            field.onChange(
                                                time ? time.format('HH:mm') : ''
                                            );
                                            debouncedUpdate({
                                                releaseTime: time
                                                    ? time.format('HH:mm')
                                                    : '',
                                            });
                                        }}
                                        status={
                                            errors.releaseTime
                                                ? 'error'
                                                : undefined
                                        }
                                        showSecond={false}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="timezone"
                            label="timezone"
                            required
                            ErrorMessage={errors.timezone?.message}
                        >
                            <Controller
                                control={control}
                                name="timezone"
                                render={({ field }) => (
                                    <TimezoneSelect
                                        id="timezone"
                                        className="w-full"
                                        {...field}
                                        placeholder="Chọn múi giờ"
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debouncedUpdate({
                                                releaseTimezoneId: e,
                                            });
                                        }}
                                        status={
                                            errors.timezone
                                                ? 'error'
                                                : undefined
                                        }
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="territoryType"
                            label={messages('common.region')}
                            required
                            ErrorMessage={errors.territoryType?.message}
                        >
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
                        </FormItem>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
