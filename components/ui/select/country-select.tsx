import { useGetListCountries } from '@/modules/countries/hooks/use-get-list-countries';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'option'> & {
    fallBack?: string;
};

export default function CountrySelect({ fallBack, ...props }: Props) {
    const { countriesData } = useGetListCountries({ pageSize: 9999 });

    const options = countriesData.items.map((item) => {
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

    return <Select {...props} options={options} labelRender={labelRender} />;
}
