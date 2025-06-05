import { genresList } from '@/constants/fakeData';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {};

export default function GenresSelect({ ...props }: Props) {
    const messages = useTranslations();
    const option = genresList.map((item, index) => {
        return {
            id: index,
            value: item?.value,
            label: item?.label,
        };
    });

    return <Select {...props} options={option} />;
}
