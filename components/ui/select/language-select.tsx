import { useGetListLanguage } from '@/modules/languages/hooks/use-get-list-language';
import { LanguagesData } from '@/modules/languages/types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {};

export default function LanguageSelect({ ...props }: Props) {
    // const messages = useTranslations();
    const { languagesData } = useGetListLanguage({});
    const option = languagesData?.items.map(
        (item: LanguagesData, index: number) => {
            return {
                id: item.id,
                value: item.id,
                label: item.name,
            };
        }
    );

    return <Select {...props} options={option} />;
}
