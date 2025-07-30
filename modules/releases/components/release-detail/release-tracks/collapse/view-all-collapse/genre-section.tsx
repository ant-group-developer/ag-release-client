import FormItem from '@/components/ui/react-hook-form/form-item';
import GenresSelect from '@/components/ui/select/genres-select';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { ReleaseTrackSchema } from '@/modules/tracks/schemas';
import { TrackData } from '@/modules/tracks/types';
import { Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

const { Title } = Typography;

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any) => void;
    trackData: TrackData;
};

export default function GenreSection({
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
            defaultActiveKey={['genre']}
            items={[
                {
                    key: 'genre',
                    label: (
                        <Title level={5} className="!mb-0">
                            {messages('genre.label')}
                        </Title>
                    ),
                    children: (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FormItem
                                    label={messages('genres.primary')}
                                    ErrorMessage={
                                        errors.primaryGenreId?.message
                                    }
                                    required
                                    name="primaryGenreId"
                                >
                                    <Controller
                                        name="primaryGenreId"
                                        control={control}
                                        render={({ field }) => (
                                            <GenresSelect
                                                id={`tracks.${index}.primaryGenreId`}
                                                className="w-full"
                                                showSearch
                                                {...field}
                                                fallBack={
                                                    trackData?.primaryGenre
                                                        ?.name
                                                }
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    updateTrackDraft(
                                                        { primaryGenreId: e },
                                                        'primaryGenreId'
                                                    );
                                                }}
                                                status={
                                                    errors.primaryGenreId
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
                                    label={messages('common.subGenres')}
                                    ErrorMessage={errors.subGenreId?.message}
                                    name="subGenreId"
                                >
                                    <Controller
                                        name="subGenreId"
                                        control={control}
                                        render={({ field }) => (
                                            <GenresSelect
                                                id={`tracks.${index}.subGenreId`}
                                                className="w-full"
                                                showSearch
                                                allowClear
                                                {...field}
                                                fallBack={
                                                    trackData?.subGenre?.name
                                                }
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    updateTrackDraft(
                                                        { subGenreId: e },
                                                        'subGenreId'
                                                    );
                                                }}
                                                status={
                                                    errors.subGenreId
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
