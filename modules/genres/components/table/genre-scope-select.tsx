import { Select } from 'antd';
import { useTranslations } from 'next-intl';
import { GENRE_SCOPE } from '../../enums';
import { useUpdateGenre } from '../../hooks/use-update-genre';
import { GenresData } from '../../types';

type GenreScopeSelectProps = {
    value?: GENRE_SCOPE;
    record: GenresData;
};

export const GenreScopeSelect = ({ value, record }: GenreScopeSelectProps) => {
    const messages = useTranslations();
    const { updateGenre, isPending } = useUpdateGenre();

    const handleChange = (newScope: GENRE_SCOPE) => {
        if (newScope === value) return;
        updateGenre({
            id: record.id,
            payload: {
                scope: newScope,
            },
        });
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Select
                value={value ?? GENRE_SCOPE.AUDIO}
                loading={isPending}
                className="w-full min-w-[120px]"
                onChange={handleChange}
                options={[
                    {
                        label: messages('common.audio'),
                        value: GENRE_SCOPE.AUDIO,
                    },
                    {
                        label: messages('common.video'),
                        value: GENRE_SCOPE.VIDEO,
                    },
                    {
                        label: messages('common.both'),
                        value: GENRE_SCOPE.BOTH,
                    },
                ]}
            />
        </div>
    );
};
