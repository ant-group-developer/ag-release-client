import { useGetListGenres } from '@/modules/genres/hooks/use-get-list-genres';
import { GenresData } from '@/modules/genres/types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function GenresSelect({ fallBack, ...props }: Props) {
    const { genresData } = useGetListGenres({});
    const option = genresData?.items.map((item: GenresData, index: number) => {
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

    return <Select {...props} options={option} labelRender={labelRender} />;
}
