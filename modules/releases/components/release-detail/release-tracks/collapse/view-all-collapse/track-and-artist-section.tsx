import { LabelForm } from '@/components/ui/label/labelForm';
import ErrorText from '@/components/ui/text/error-text';
import { useRouter } from '@/i18n/routing';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import {
    releaseTrackSchema,
    ReleaseTrackSchema,
} from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any, fieldName?: string) => void;
    trackData: TrackData;
};

export default function TrackAndArtistSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    // hook - state
    const messages = useTranslations();

    const formMethods = useForm<ReleaseTrackSchema>({
        // defaultValues: {
        //     ...trackData,
        // },
        resolver: zodResolver(releaseTrackSchema(messages)),
        mode: 'onChange',
        reValidateMode: 'onChange',
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        watch,
        trigger,
        reset,
        setValue,
    } = formMethods;

    // router
    const params = useParams();
    const router = useRouter();

    return (
        <CollapseItem
            defaultActiveKey={['track-and-artist']}
            items={[
                {
                    key: 'track-and-artist',
                    label: (
                        <Title level={4} className="!mb-0">
                            {messages('tracks.label')} &{' '}
                            {messages('artist.label')}
                        </Title>
                    ),
                    children: (
                        <div>
                            <div className="grid grid-cols-3 items-center gap-5">
                                <div className="col-span-3">
                                    <div>
                                        <LabelForm
                                            htmlFor="title"
                                            required
                                            label={messages('tracks.name')}
                                        />
                                        <Controller
                                            control={control}
                                            name="title"
                                            render={({ field }) => (
                                                <Input
                                                    id={`tracks.${index}.title`}
                                                    {...field}
                                                    allowClear
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdateTrackDraft(
                                                            {
                                                                title: value,
                                                            },
                                                            'title'
                                                        );
                                                    }}
                                                    status={
                                                        errors.title
                                                            ? 'error'
                                                            : undefined
                                                    }
                                                />
                                            )}
                                        />
                                        <ErrorText
                                            isError={!!errors.title}
                                            message={errors.title?.message}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ),
                },
            ]}
        />
    );
}
