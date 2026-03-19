import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import TimezoneSelect from '@/components/ui/select/timezone-select';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { DATE_FORMAT, DISTRIBUTE_TYPES } from '@/enums/common';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useHash } from '@/hooks/use-hash';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { RELEASE_TIME_MODE } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { releaseSchema } from '@/modules/releases/schemas';
import { ReleasesData } from '@/modules/releases/types';
import { UpdateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { UpdateVariables } from '@/types/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePicker, Radio, theme, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

const releaseSchedulingSchema = (messages: any) =>
    releaseSchema(messages).pick({
        releaseDate: true,
        releaseOriginalDate: true,
        releaseTime: true,
        releaseTimezoneId: true,
        releaseTerritory: true,
        releaseTimeMode: true,
    });

export type ReleaseSchedulingSchema = z.infer<
    ReturnType<typeof releaseSchedulingSchema>
>;

type Props = {};

export default function ReleaseSchedulingForm({}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const { updateReleaseDraft } = useUpdateReleaseDraft();
    const action = useReleaseActionStore((s) => s.action);
    const hash = useHash();

    const isReadMode = useMemo(
        () => action !== RELEASE_DETAIL_ACTION.EDIT,
        [action]
    );

    const formMethods = useForm<ReleaseSchedulingSchema>({
        defaultValues: {
            releaseDate: formValues?.releaseDate,
            releaseOriginalDate: formValues?.releaseOriginalDate,
            releaseTime: formValues?.releaseTime,
            releaseTimezoneId: formValues?.releaseTimezoneId,
            releaseTerritory: {
                distributeWorldwide:
                    formValues?.releaseTerritory?.distributeWorldwide,
                distributionType:
                    formValues?.releaseTerritory?.distributionType,
                selectedCountries:
                    formValues?.releaseTerritory?.selectedCountries,
            },
            releaseTimeMode: formValues?.releaseTimeMode,
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
        reset,
        clearErrors,
    } = formMethods;
    console.log('🚀 ~ ReleaseSchedulingForm ~ errors:', errors);

    const releaseTimeMode = useWatch({ control, name: 'releaseTimeMode' });

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
        if (!formValues.id) return;
        const initialFormValue: ReleaseSchedulingSchema = {
            releaseDate: formValues?.releaseDate || '',
            releaseOriginalDate: formValues?.releaseOriginalDate || '',
            releaseTime: formValues?.releaseTime || '',
            releaseTimezoneId: formValues?.releaseTimezoneId || null,
            releaseTerritory: {
                distributeWorldwide:
                    formValues?.releaseTerritory?.distributeWorldwide ?? true,
                distributionType:
                    formValues?.releaseTerritory?.distributionType || '',
                selectedCountries:
                    formValues?.releaseTerritory?.selectedCountries || [],
            },
            releaseTimeMode:
                formValues?.releaseTimeMode ||
                RELEASE_TIME_MODE.GLOBAL_MIDNIGHT,
        };
        reset(initialFormValue, {
            keepErrors: true,
        });
    }, [formValues, reset]);

    useEffect(() => {
        const handleTriggerField = async () => {
            const hashValue = window.location.hash;
            if (hashValue) {
                const field = hashValue.replace('#', '');
                const el = document.getElementById(field);
                if (el) {
                    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
                }
                clearErrors();
                await trigger(field as any);
            }
        };
        window.addEventListener('hashchange', handleTriggerField);

        handleTriggerField();

        return () => {
            window.removeEventListener('hashchange', handleTriggerField);
        };
    }, [trigger, hash, clearErrors]);

    return (
        <div
            className="rounded-lg p-4"
            style={{ backgroundColor: token.colorBgContainer }}
        >
            <FormProvider {...formMethods}>
                <form className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-6 gap-x-12">
                        <FormItem
                            name="releaseDate"
                            label={messages('release.releaseDate')}
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
                            name="releaseOriginalDate"
                            label={messages('release.releaseOriginalDate')}
                            required
                            ErrorMessage={errors.releaseOriginalDate?.message}
                        >
                            <Controller
                                control={control}
                                name="releaseOriginalDate"
                                render={({ field }) => {
                                    return (
                                        <DatePicker
                                            id="releaseOriginalDate"
                                            className="w-full"
                                            format={DATE_FORMAT.DATE_ONLY}
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
                                                    releaseOriginalDate: date,
                                                });
                                            }}
                                            status={
                                                errors.releaseOriginalDate
                                                    ? 'error'
                                                    : undefined
                                            }
                                            disabled={isReadMode}
                                        />
                                    );
                                }}
                            />
                        </FormItem>

                        <div className="space-y-2">
                            <FormItem
                                name="releaseTimeMode"
                                label={messages(
                                    'release.scheduling.goLiveTime'
                                )}
                                required
                                ErrorMessage={errors.releaseTimeMode?.message}
                            >
                                <Controller
                                    control={control}
                                    name="releaseTimeMode"
                                    render={({ field }) => (
                                        <Radio.Group
                                            {...field}
                                            id="releaseTimeMode"
                                            onChange={(e) => {
                                                field.onChange(e.target.value);
                                                debouncedUpdate({
                                                    releaseTimeMode:
                                                        e.target.value,
                                                });
                                            }}
                                            disabled={isReadMode}
                                        >
                                            <Radio
                                                value={
                                                    RELEASE_TIME_MODE.GLOBAL_MIDNIGHT
                                                }
                                            >
                                                {messages(
                                                    'release.scheduling.atMidnightInEveryCountry'
                                                )}
                                            </Radio>
                                            <Radio
                                                value={
                                                    RELEASE_TIME_MODE.SPECIFIC_TIMEZONE
                                                }
                                            >
                                                {messages(
                                                    'release.scheduling.atSpecificTime'
                                                )}
                                            </Radio>
                                        </Radio.Group>
                                    )}
                                />
                            </FormItem>

                            {releaseTimeMode ===
                                RELEASE_TIME_MODE.SPECIFIC_TIMEZONE && (
                                <div className="space-y-2">
                                    <FormItem
                                        name="releaseTimezoneId"
                                        label={messages('timezone.zone')}
                                        required
                                        ErrorMessage={
                                            errors.releaseTimezoneId?.message
                                        }
                                    >
                                        <Controller
                                            control={control}
                                            name="releaseTimezoneId"
                                            render={({ field }) => (
                                                <TimezoneSelect
                                                    fallBack={`${
                                                        formValues?.timeZone
                                                            ?.name
                                                    } ${formValues?.timeZone?.utc}`}
                                                    id="releaseTimezoneId"
                                                    className="w-full"
                                                    {...field}
                                                    placeholder={messages(
                                                        'timezone.placeholder.selectTimezone'
                                                    )}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        debouncedUpdate({
                                                            releaseTimezoneId:
                                                                e,
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

                                    <FormItem
                                        name="releaseTime"
                                        label={messages('common.releaseTime')}
                                        required
                                        ErrorMessage={
                                            errors.releaseTime?.message
                                        }
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
                                </div>
                            )}
                        </div>

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
                                        name="releaseTerritory.distributionType"
                                        label={' '}
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
                                                    id="distributionType"
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
