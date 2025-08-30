import { toNonAccentVietnamese } from '@/helpers/string';
import useModalStore from '@/hooks/use-modal';
import { useGetListSimpleCurrencies } from '@/modules/currencies/hooks/use-get-list-simple-currencies';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function CurrenciesSelect({ fallBack, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { currenciesData } = useGetListSimpleCurrencies();
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
            options={currenciesData.map((item) => ({
                id: item.id,
                value: item.id,
                label: `${item.code} - ${item.name}`,
            }))}
            labelRender={labelRender}
        />
    );
}
