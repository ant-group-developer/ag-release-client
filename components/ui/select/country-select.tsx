import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleCountries } from '@/modules/countries/hooks/use-get-list-simple-countries';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'option'> & {
    fallBack?: string;
};

export default function CountrySelect({ fallBack, ...props }: Props) {
    const { countriesData } = useGetListSimpleCountries();

    const options = countriesData.map((item) => {
        return {
            id: item.id,
            value: item.id,
            label: (
                <div className="space-x-1">
                    <span className="!text-xs">{item?.iso2}</span>
                    <span>{item?.name}</span>
                </div>
            ),
            title: item?.name,
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
            options={options}
            labelRender={labelRender}
        />
    );
}
