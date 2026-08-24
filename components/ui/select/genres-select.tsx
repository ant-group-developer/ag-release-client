import { toNonAccentVietnamese } from '@/helpers/string';
import { GENRE_SCOPE } from '@/modules/genres/enums';
import { useGetListSimpleGenres } from '@/modules/genres/hooks/use-get-list-simple-genres';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
    scope?: GENRE_SCOPE;
};

export default function GenresSelect({ fallBack, scope, ...props }: Props) {
    const { genresData } = useGetListSimpleGenres({ scope });
    const option = genresData?.map((item) => {
        return {
            id: item.id,
            value: item.id,
            label: item.name,
        };
    });

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            {...props}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.label ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={option}
            labelRender={labelRender}
        />
    );
}
