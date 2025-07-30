import FormItem from '@/components/ui/react-hook-form/form-item';
import CountrySelect from '@/components/ui/select/country-select';
import OriginalTypeSelect from '@/components/ui/select/original-type-select';
import TrackTypesSelect from '@/components/ui/select/track-types-select';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { ReleaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/lib/typography/Title';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any) => void;
    trackData: TrackData;
};

export default function OtherSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    const messages = useTranslations();

    const {
        control,
        formState: { errors },
        watch,
        trigger,
        setValue,
    } = useFormContext<ReleaseTrackSchema>();

    const [year, ownerCopyRight] = (trackData.pLineOwner || '').split(' ');
    const copyRightYearList = () => {
        const currentYear = dayjs().year();
        return [
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
    };
    const copyRightYears = copyRightYearList();

    const updateTrackDraft = async (data: any, fieldName?: string) => {
        if (fieldName) {
            const isValid = await trigger(
                fieldName as keyof ReleaseTrackSchema
            );
            if (!isValid) return;
        }
        debouncedUpdateTrackDraft(data);
    };
    return (
        <CollapseItem
            defaultActiveKey={['other']}
            items={[
                {
                    key: 'other',
                    label: (
                        <Title level={5} className="!mb-0">
                            {messages('common.other')}
                        </Title>
                    ),
                    children: (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FormItem
                                    label={messages(
                                        'formFields.tracks.sensitiveContent'
                                    )}
                                    ErrorMessage={
                                        errors.isSensitiveContent?.message
                                    }
                                    required
                                    name="isSensitiveContent"
                                >
                                    <Controller
                                        name="isSensitiveContent"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                id={`tracks.${index}.isSensitiveContent`}
                                                className="w-full"
                                                showSearch
                                                options={[
                                                    {
                                                        label: messages(
                                                            'common.yes'
                                                        ),
                                                        value: true,
                                                    },
                                                    {
                                                        label: messages(
                                                            'common.no'
                                                        ),
                                                        value: false,
                                                    },
                                                ]}
                                                {...field}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    updateTrackDraft(
                                                        {
                                                            isSensitiveContent:
                                                                e,
                                                        },
                                                        'isSensitiveContent'
                                                    );
                                                }}
                                                status={
                                                    errors.isSensitiveContent
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <div>
                                <FormItem
                                    label={messages('trackOriginType.label')}
                                    ErrorMessage={
                                        errors.trackOriginTypeId?.message
                                    }
                                    required
                                    name="trackOriginTypeId"
                                >
                                    <Controller
                                        name="trackOriginTypeId"
                                        control={control}
                                        render={({ field }) => (
                                            <OriginalTypeSelect
                                                id={`tracks.${index}.trackOriginTypeId`}
                                                {...field}
                                                fallBack={
                                                    trackData?.trackOriginType
                                                        ?.name
                                                }
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    updateTrackDraft(
                                                        {
                                                            trackOriginTypeId:
                                                                e,
                                                        },
                                                        'trackOriginTypeId'
                                                    );
                                                }}
                                                className="w-full"
                                                status={
                                                    errors.trackOriginTypeId
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <div className="col-span-2">
                                <FormItem
                                    label={messages('formFields.tracks.lyrics')}
                                    ErrorMessage={errors.lyric?.message}
                                    name="lyric"
                                >
                                    <Controller
                                        name="lyric"
                                        control={control}
                                        render={({ field }) => (
                                            <TextArea
                                                {...field}
                                                id={`tracks.${index}.lyric`}
                                                value={field.value ?? ''}
                                                rows={1}
                                                autoSize={{
                                                    minRows: 1,
                                                    maxRows: 20,
                                                }}
                                                onChange={(e) => {
                                                    field.onChange(
                                                        e.target.value
                                                    );
                                                    updateTrackDraft(
                                                        {
                                                            lyric: e.target
                                                                .value,
                                                        },
                                                        'lyric'
                                                    );
                                                }}
                                                status={
                                                    errors.lyric
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>

                            <div>
                                <FormItem
                                    name="trackLanguage.recordingCountryId"
                                    label={messages('tracks.recordingCountry')}
                                    required
                                    ErrorMessage={
                                        errors.trackLanguage?.recordingCountryId
                                            ?.message
                                    }
                                >
                                    <Controller
                                        control={control}
                                        name="trackLanguage.recordingCountryId"
                                        render={({ field }) => (
                                            <CountrySelect
                                                id={`tracks.${index}.trackLanguage.recordingCountryId`}
                                                status={
                                                    errors.trackLanguage
                                                        ?.recordingCountryId
                                                        ? 'error'
                                                        : undefined
                                                }
                                                className="w-full"
                                                {...field}
                                                fallBack={
                                                    trackData?.trackLanguage
                                                        ?.recordingCountry?.name
                                                }
                                                showSearch
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    updateTrackDraft({
                                                        trackLanguage: {
                                                            recordingCountryId:
                                                                e,
                                                        },
                                                    });
                                                }}
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <div>
                                <FormItem
                                    name="trackTypeId"
                                    label={messages('trackType.label')}
                                    required
                                    ErrorMessage={errors.trackTypeId?.message}
                                >
                                    <Controller
                                        control={control}
                                        name="trackTypeId"
                                        render={({ field }) => (
                                            <TrackTypesSelect
                                                id={`tracks.${index}.trackTypeId`}
                                                status={
                                                    errors.trackTypeId
                                                        ? 'error'
                                                        : undefined
                                                }
                                                className="w-full"
                                                {...field}
                                                fallBack={
                                                    trackData?.trackType?.name
                                                }
                                                value={field.value ?? ''}
                                                showSearch
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    updateTrackDraft({
                                                        trackTypeId: e,
                                                    });
                                                }}
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <div>
                                <FormItem
                                    label={messages('formFields.pLine')}
                                    ErrorMessage={errors.pLineOwner?.message}
                                    required
                                    name="pLineOwner"
                                >
                                    <Controller
                                        name="pLineOwner"
                                        control={control}
                                        render={({ field }) => {
                                            const [year, ownerCopyRight] =
                                                field.value?.split(' ') || [];
                                            const handleYearChange = (
                                                newYear: string
                                            ) => {
                                                const value =
                                                    `${newYear} ${ownerCopyRight ?? ''}`.trim();
                                                field.onChange(value);
                                                updateTrackDraft(
                                                    { pLineOwner: value },
                                                    'pLineOwner'
                                                );
                                            };
                                            const handleOwnerChange = (
                                                e: React.ChangeEvent<HTMLInputElement>
                                            ) => {
                                                const value =
                                                    `${year} ${e.target.value}`.trim();
                                                field.onChange(value);
                                                updateTrackDraft(
                                                    { pLineOwner: value },
                                                    'pLineOwner'
                                                );
                                            };
                                            return (
                                                <Input
                                                    id={`tracks.${index}.pLineOwner`}
                                                    value={ownerCopyRight}
                                                    onChange={handleOwnerChange}
                                                    allowClear
                                                    status={
                                                        errors.pLineOwner
                                                            ? 'error'
                                                            : undefined
                                                    }
                                                    addonBefore={
                                                        <Select
                                                            defaultValue={year}
                                                            value={year}
                                                            onChange={
                                                                handleYearChange
                                                            }
                                                            options={
                                                                copyRightYears
                                                            }
                                                            style={{
                                                                width: 90,
                                                            }}
                                                            placeholder={messages(
                                                                'common.year'
                                                            )}
                                                        />
                                                    }
                                                />
                                            );
                                        }}
                                    />
                                </FormItem>
                            </div>
                            <div>
                                <FormItem
                                    label="ISRC"
                                    ErrorMessage={errors.isrc?.message}
                                    name="isrc"
                                >
                                    <Controller
                                        name="isrc"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                id={`tracks.${index}.isrc`}
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    field.onChange(value);
                                                    updateTrackDraft(
                                                        { isrc: value },
                                                        'isrc'
                                                    );
                                                }}
                                                allowClear
                                                status={
                                                    errors.isrc
                                                        ? 'error'
                                                        : undefined
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                        </div>
                    ),
                },
            ]}
        />
    );
}
