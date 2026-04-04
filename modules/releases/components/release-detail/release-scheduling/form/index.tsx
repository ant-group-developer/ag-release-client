import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
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
import InputRegionCode from './input-region-code';

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
        setError,
    } = formMethods;

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
                <AppForm className="flex flex-col gap-4" layout="vertical">
                    <div className="grid grid-cols-2 gap-6 gap-x-12">
                        <AppFormItem
                            name="releaseDate"
                            label={messages('release.releaseDate')}
                            required
                            help={errors.releaseDate?.message}
                            validateStatus={errors.releaseDate ? 'error' : ''}
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
                                            value={
                                                field.value
                                                    ? dayjs(field.value)
                                                    : null
                                            }
                                            onChange={(date) => {
                                                field.onChange(
                                                    date
                                                        ? date.toISOString()
                                                        : null
                                                );
                                                debouncedUpdate({
                                                    releaseDate: date
                                                        ? date.toISOString()
                                                        : null,
                                                });
                                            }}
                                            disabled={isReadMode}
                                        />
                                    );
                                }}
                            />
                        </AppFormItem>

                        <AppFormItem
                            name="releaseOriginalDate"
                            label={messages('release.releaseOriginalDate')}
                            required
                            help={errors.releaseOriginalDate?.message}
                            validateStatus={
                                errors.releaseOriginalDate ? 'error' : ''
                            }
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
                                                    date
                                                        ? date.toISOString()
                                                        : null
                                                );
                                                debouncedUpdate({
                                                    releaseOriginalDate: date
                                                        ? date.toISOString()
                                                        : null,
                                                });
                                            }}
                                            disabled={isReadMode}
                                        />
                                    );
                                }}
                            />
                        </AppFormItem>

                        <div className="space-y-2">
                            <AppFormItem
                                name="releaseTimeMode"
                                label={messages(
                                    'release.scheduling.goLiveTime'
                                )}
                                required
                                help={errors.releaseTimeMode?.message}
                                validateStatus={
                                    errors.releaseTimeMode ? 'error' : ''
                                }
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
                            </AppFormItem>

                            {releaseTimeMode ===
                                RELEASE_TIME_MODE.SPECIFIC_TIMEZONE && (
                                <div className="space-y-2">
                                    <AppFormItem
                                        name="releaseTimezoneId"
                                        label={messages('timezone.zone')}
                                        required
                                        help={errors.releaseTimezoneId?.message}
                                        validateStatus={
                                            errors.releaseTimezoneId
                                                ? 'error'
                                                : ''
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
                                                    disabled={isReadMode}
                                                />
                                            )}
                                        />
                                    </AppFormItem>

                                    <AppFormItem
                                        name="releaseTime"
                                        label={messages('common.releaseTime')}
                                        required
                                        help={errors.releaseTime?.message}
                                        validateStatus={
                                            errors.releaseTime ? 'error' : ''
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
                                    </AppFormItem>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <AppFormItem
                                required
                                name="releaseTerritory.distributeWorldwide"
                                label={messages('distribute.wordWide')}
                                help={
                                    errors.releaseTerritory?.distributeWorldwide
                                        ?.message
                                }
                                validateStatus={
                                    errors.releaseTerritory?.distributeWorldwide
                                        ? 'error'
                                        : ''
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
                            </AppFormItem>

                            {!distributeWorldwide && (
                                <>
                                    <AppFormItem
                                        name="releaseTerritory.distributionType"
                                        label={' '}
                                        help={
                                            errors.releaseTerritory
                                                ?.distributionType?.message
                                        }
                                        validateStatus={
                                            errors.releaseTerritory
                                                ?.distributionType
                                                ? 'error'
                                                : ''
                                        }
                                        labelCol={{ span: 0 }}
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
                                    </AppFormItem>
                                    <AppFormItem
                                        name="releaseTerritory.selectedCountries"
                                        label={messages('common.region')}
                                        required
                                        help={
                                            errors.releaseTerritory
                                                ?.selectedCountries?.message
                                        }
                                        validateStatus={
                                            errors.releaseTerritory
                                                ?.selectedCountries
                                                ? 'error'
                                                : ''
                                        }
                                    >
                                        <Controller
                                            control={control}
                                            name="releaseTerritory.selectedCountries"
                                            render={({ field }) => {
                                                return (
                                                    <CountrySelect
                                                        className="w-full"
                                                        id="releaseTerritory.selectedCountries"
                                                        mode="multiple"
                                                        allowClear
                                                        maxTagCount="responsive"
                                                        disabled={isReadMode}
                                                        maxTagPlaceholder={(
                                                            value
                                                        ) => {
                                                            return (
                                                                <CustomTooltip
                                                                    title={value.map(
                                                                        (
                                                                            item: any
                                                                        ) =>
                                                                            item.label
                                                                    )}
                                                                    styles={{
                                                                        body: {
                                                                            width: '300px',
                                                                            maxHeight:
                                                                                '400px',
                                                                            overflowY:
                                                                                'auto',
                                                                        },
                                                                    }}
                                                                >
                                                                    +{' '}
                                                                    {
                                                                        value.length
                                                                    }
                                                                </CustomTooltip>
                                                            );
                                                        }}
                                                        {...field}
                                                        onChange={(value) => {
                                                            field.onChange(
                                                                value
                                                            );
                                                            debouncedUpdate({
                                                                releaseTerritory:
                                                                    {
                                                                        selectedCountries:
                                                                            value,
                                                                    },
                                                            });
                                                        }}
                                                    />
                                                );
                                            }}
                                        />
                                    </AppFormItem>

                                    <AppFormItem
                                        name="releaseTerritory.selectedCountries"
                                        label={messages('common.regionCode')}
                                        help={
                                            errors.releaseTerritory
                                                ?.selectedCountries?.message
                                        }
                                        validateStatus={
                                            errors.releaseTerritory
                                                ?.selectedCountries
                                                ? 'error'
                                                : ''
                                        }
                                    >
                                        <Controller
                                            control={control}
                                            name="releaseTerritory.selectedCountries"
                                            render={({ field }) => (
                                                <InputRegionCode
                                                    disabled={isReadMode}
                                                    onChange={field.onChange}
                                                    value={field?.value ?? []}
                                                />
                                            )}
                                        />
                                    </AppFormItem>
                                </>
                            )}
                        </div>
                    </div>
                </AppForm>
            </FormProvider>
        </div>
    );
}
