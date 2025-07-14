import { useGetListGenres } from '@/modules/genres/hooks/use-get-list-genres';
import { GenresData } from '@/modules/genres/types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {};

export default function GenresSelect({ ...props }: Props) {
    // const messages = useTranslations();
    const { genresData } = useGetListGenres({});
    const option = genresData?.items.map((item: GenresData, index: number) => {
        return {
            id: item.id,
            value: item.id,
            label: item.name,
        };
    });
    // const option = Object.values(GENRES).map((item: string, index: number) => {
    //     return {
    //         id: index,
    //         value: item,
    //         label: messages(getIntlCodeByGenres(item)),
    //     };
    // });

    return <Select {...props} options={option} />;
}
