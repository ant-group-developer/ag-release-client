import useModalStore from '@/hooks/use-modal';
import { useGetListCountries } from '@/modules/countries/hooks/use-get-list-countries';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<SelectProps, 'option'> & {};

export default function CountrySelect({ ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { countriesData } = useGetListCountries({ pageSize: 9999 });

    const options = countriesData.items.map((item) => {
        return {
            id: item.id,
            value: item.id,
            label: item.name,
        };
    });

    return <Select {...props} options={options} />;
}
