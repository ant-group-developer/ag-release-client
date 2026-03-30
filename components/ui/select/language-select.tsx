import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleLanguage } from '@/modules/languages/hooks/use-get-list-simple-language';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function LanguageSelect({ fallBack, ...props }: Props) {
    const { languagesData } = useGetListSimpleLanguage();
    const option = languagesData?.map((item) => {
        return {
            id: item.id,
            value: item.id,
            label: (
                <div className="space-x-1">
                    <span className="!text-xs">{item?.code}</span>
                    <span>{item?.name}</span>
                </div>
            ),
            name: item?.name,
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
                toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={option}
            labelRender={labelRender}
        />
    );
}
