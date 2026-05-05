import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleLanguage } from '@/modules/languages/hooks/use-get-list-simple-language';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function LanguageSelect({ fallBack, ...props }: Props) {
    const { languagesData } = useGetListSimpleLanguage();
    const option =
        languagesData?.map((item) => {
            const isNoLanguage = item?.code === 'NoLanguage';
            return {
                id: item.id,
                value: item.id,
                label: (
                    <div
                        className={`space-x-1 ${
                            isNoLanguage ? 'text-blue-500' : ''
                        }`}
                    >
                        <span className="!text-xs opacity-60">
                            {item?.code}
                        </span>
                        <span>{item?.name}</span>
                    </div>
                ),
                name: item?.name,
                code: item?.code,
            };
        }) || [];

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
            filterOption={(input, option: any) => {
                const searchValue = toNonAccentVietnamese(input).toLowerCase();
                const nameMatch = toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(searchValue);
                const codeMatch = toNonAccentVietnamese(option?.code ?? '')
                    .toLowerCase()
                    .includes(searchValue);
                return nameMatch || codeMatch;
            }}
            options={option}
            labelRender={labelRender}
        />
    );
}
