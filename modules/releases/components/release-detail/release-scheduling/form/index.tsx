import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import TimezoneSelect from '@/components/ui/select/timezone-select';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT, DISTRIBUTE_TYPES } from '@/enums/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseDetailActionStore } from '@/modules/releases/hooks/use-release-action-store';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { releaseSchema } from '@/modules/releases/schemas';
import { ReleasesData } from '@/modules/releases/types';
import { UpdateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, Radio, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';

const releaseSchedulingSchema = (messages: any) =>
    releaseSchema(messages).pick({
        releaseDate: true,
        releaseTime: true,
        releaseTimezoneId: true,
        releaseTerritory: true,
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
    const releaseDetailAction = useReleaseDetailActionStore(
        (state) => state.action
    );
    const isReadMode = useMemo(
        () => releaseDetailAction !== RELEASE_DETAIL_ACTION.EDIT,
        [releaseDetailAction]
    );

    const formMethods = useForm<ReleaseSchedulingSchema>({
        defaultValues: {
            releaseDate: formValues?.releaseDate,
            releaseTime: formValues?.releaseTime,
            releaseTimezoneId: formValues?.releaseTimezoneId,
            releaseTerritory: {
                distributeWorldwide:
                    formValues?.releaseTerritory?.distributeWorldwide ?? true,
                distributionType:
                    formValues?.releaseTerritory?.distributionType,
                selectedCountries:
                    formValues?.releaseTerritory?.selectedCountries,
            },
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

    const distributeWorldwide = watch('releaseTerritory.distributeWorldwide');

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

    useEffect(() => {
        const handleTriggerField = () => {
            const hash = window.location.hash;
            if (hash) {
                const field = hash.replace('#', '');
                trigger(field as any);
            }
        };
        window.addEventListener('hashchange', handleTriggerField);

        handleTriggerField();

        return () => {
            window.removeEventListener('hashchange', handleTriggerField);
        };
    }, []);

    return (
        <div className="rounded-lg bg-white">
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
                                render={({ field }) => {
                                    return (
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
                                                    ? dayjs(field.value)
                                                    : null
                                            }
                                            onChange={(date) => {
                                                field.onChange(
                                                    date.toISOString()
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
                                            disabled={isReadMode}
                                        />
                                    );
                                }}
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
                                        id="releaseTime"
                                        className="w-full"
                                        value={
                                            field.value
                                                ? dayjs(
                                                      field.value,
                                                      DATE_FORMAT.HOUR_MINUTE
                                                  )
                                                : null
                                        }
                                        onChange={(time) => {
                                            field.onChange(
                                                time
                                                    ? time.format(
                                                          DATE_FORMAT.HOUR_MINUTE
                                                      )
                                                    : ''
                                            );
                                            debouncedUpdate({
                                                releaseTime: time
                                                    ? time.format(
                                                          DATE_FORMAT.HOUR_MINUTE
                                                      )
                                                    : '',
                                            });
                                        }}
                                        status={
                                            errors.releaseTime
                                                ? 'error'
                                                : undefined
                                        }
                                        showSecond={false}
                                        disabled={isReadMode}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            name="releaseTimezoneId"
                            label="timezone"
                            required
                            ErrorMessage={errors.releaseTimezoneId?.message}
                        >
                            <Controller
                                control={control}
                                name="releaseTimezoneId"
                                render={({ field }) => (
                                    <TimezoneSelect
                                        id="releaseTimezoneId"
                                        className="w-full"
                                        {...field}
                                        placeholder={messages(
                                            'timezone.placeholder.selectTimezone'
                                        )}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debouncedUpdate({
                                                releaseTimezoneId: e,
                                            });
                                        }}
                                        status={
                                            errors.releaseTimezoneId
                                                ? 'error'
                                                : undefined
                                        }
                                        disabled={isReadMode}
                                    />
                                )}
                            />
                        </FormItem>

                        <div className="space-y-2">
                            <FormItem
                                required
                                name="releaseTerritory.distributeWorldwide"
                                label={messages('distribute.wordWide')}
                                ErrorMessage={
                                    errors.releaseTerritory?.distributeWorldwide
                                        ?.message
                                }
                            >
                                <Controller
                                    control={control}
                                    name="releaseTerritory.distributeWorldwide"
                                    defaultValue={true}
                                    render={({ field }) => {
                                        return (
                                            <Radio.Group
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        e.target.value
                                                    );
                                                    debouncedUpdate({
                                                        releaseTerritory: {
                                                            distributeWorldwide:
                                                                e.target.value,
                                                        },
                                                    });
                                                }}
                                                disabled={isReadMode}
                                            >
                                                <Radio value={true}>
                                                    {messages('common.yes')}
                                                </Radio>
                                                <Radio value={false}>
                                                    {messages('common.no')}
                                                </Radio>
                                            </Radio.Group>
                                        );
                                    }}
                                />
                            </FormItem>

                            {!distributeWorldwide && (
                                <>
                                    <FormItem
                                        required
                                        name="releaseTerritory.distributionType"
                                        label={messages('select.option')}
                                        ErrorMessage={
                                            errors.releaseTerritory
                                                ?.distributionType?.message
                                        }
                                    >
                                        <Controller
                                            control={control}
                                            name="releaseTerritory.distributionType"
                                            render={({ field }) => (
                                                <Radio.Group
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(
                                                            e.target.value
                                                        );
                                                        debouncedUpdate({
                                                            releaseTerritory: {
                                                                distributionType:
                                                                    e.target
                                                                        .value,
                                                            },
                                                        });
                                                    }}
                                                    disabled={isReadMode}
                                                >
                                                    <Radio
                                                        value={
                                                            DISTRIBUTE_TYPES.DISTRIBUTE_ONLY_IN
                                                        }
                                                    >
                                                        {messages(
                                                            'distribute.onlyIn'
                                                        )}
                                                    </Radio>
                                                    <Radio
                                                        value={
                                                            DISTRIBUTE_TYPES.DISTRIBUTE_EVERY_WHERE_EXCEPT
                                                        }
                                                    >
                                                        {messages(
                                                            'distribute.everyWhereExcept'
                                                        )}
                                                    </Radio>
                                                </Radio.Group>
                                            )}
                                        />
                                    </FormItem>
                                    <FormItem
                                        name="releaseTerritory.selectedCountries"
                                        label={messages('common.region')}
                                        required
                                        ErrorMessage={
                                            errors.releaseTerritory
                                                ?.selectedCountries?.message
                                        }
                                    >
                                        <Controller
                                            control={control}
                                            name="releaseTerritory.selectedCountries"
                                            render={({ field }) => (
                                                <CountrySelect
                                                    className="w-full"
                                                    id="releaseTerritory.selectedCountries"
                                                    mode="multiple"
                                                    allowClear
                                                    maxTagCount="responsive"
                                                    disabled={isReadMode}
                                                    maxTagPlaceholder={(
                                                        value
                                                    ) => (
                                                        <CustomTooltip
                                                            title={value
                                                                .map(
                                                                    (
                                                                        item: any
                                                                    ) =>
                                                                        item.label
                                                                )
                                                                .join(', ')}
                                                        >
                                                            +{value.length}
                                                        </CustomTooltip>
                                                    )}
                                                    {...field}
                                                    onChange={(value) => {
                                                        field.onChange(value);
                                                        debouncedUpdate({
                                                            releaseTerritory: {
                                                                selectedCountries:
                                                                    value,
                                                            },
                                                        });
                                                    }}
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}
