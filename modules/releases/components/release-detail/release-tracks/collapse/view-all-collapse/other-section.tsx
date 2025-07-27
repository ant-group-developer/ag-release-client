import FormItem from '@/components/ui/react-hook-form/form-item';
import OriginalTypeSelect from '@/components/ui/select/original-type-select';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Title from 'antd/lib/typography/Title';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any, fieldName?: string) => void;
    trackData: TrackData;
};

export default function OtherSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    const messages = useTranslations();
    const formMethods = useForm({
        defaultValues: {
            isSensitiveContent: trackData.isSensitiveContent ?? false,
            lyric: trackData.lyric ?? '',
            pLineOwner: trackData.pLineOwner ?? `${dayjs().year()} `,
            trackOriginTypeId: trackData.trackOriginTypeId ?? '',
            isrc: trackData.isrc ?? '',
        },
        resolver: zodResolver(releaseTrackSchema(messages)),
        mode: 'onChange',
    });
    const {
        control,
        formState: { errors },
    } = formMethods;
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
    return (
        <CollapseItem
            defaultActiveKey={['other']}
            items={[
                {
                    key: 'other',
                    label: (
                        <Title level={5} className="!mb-0">
                            Khác
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
                                                    debouncedUpdateTrackDraft(
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
                                                    debouncedUpdateTrackDraft(
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
                                                    debouncedUpdateTrackDraft(
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
                            <div className="col-span-2">
                                <FormItem
                                    label="Bản quyền ghi âm"
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
                                                debouncedUpdateTrackDraft(
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
                                                debouncedUpdateTrackDraft(
                                                    { pLineOwner: value },
                                                    'pLineOwner'
                                                );
                                            };
                                            return (
                                                <Input
                                                    id="pLineOwner"
                                                    value={ownerCopyRight}
                                                    onChange={handleOwnerChange}
                                                    allowClear
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
                            <div className="col-span-2">
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
                                                id="isrc"
                                                {...field}
                                                value={field.value ?? ''}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    field.onChange(value);
                                                    debouncedUpdateTrackDraft(
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
