import { getIntlCodeByGenres } from '@/helpers/common';
import { GENRES } from '@/modules/tracks/enums';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {};

export default function GenresSelect({ ...props }: Props) {
    const messages = useTranslations();
    const option = Object.values(GENRES).map((item: string, index: number) => {
        return {
            id: index,
            value: item,
            label: messages(getIntlCodeByGenres(item)),
        };
    });

    // const option = genresList.map((item, index) => {
    //     return {
    //         id: index,
    //         value: item?.value,
    //         label: item?.label,
    //     };
    // });

    return <Select {...props} options={option} />;
}
