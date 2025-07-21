import { useGetListLanguage } from '@/modules/languages/hooks/use-get-list-language';
import { LanguagesData } from '@/modules/languages/types';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function LanguageSelect({ fallBack, ...props }: Props) {
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

    const labelRender = (props: SelectProps) => {
        const { value } = props;
        if (value) {
            return fallBack || value;
        }
    };

    return <Select {...props} options={option} labelRender={labelRender} />;
}
