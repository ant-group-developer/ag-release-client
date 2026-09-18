import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleCountries } from '@/modules/countries/hooks/use-get-list-simple-countries';
import { Select, SelectProps, Typography } from 'antd';

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
                    <Typography.Text className="!text-xs opacity-60">
                        {item?.iso2}
                    </Typography.Text>
                    <Typography.Text>{item?.name}</Typography.Text>
                </div>
            ),
            title: item?.name,
            name: item?.name,
            iso2: item?.iso2,
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
            filterOption={(input, option: any) => {
                const searchValue = toNonAccentVietnamese(input)
                    .toLowerCase()
                    .trim();
                const nameMatch = toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(searchValue);
                const iso2Match = toNonAccentVietnamese(option?.iso2 ?? '')
                    .toLowerCase()
                    .includes(searchValue);
                return nameMatch || iso2Match;
            }}
            options={options}
            labelRender={labelRender}
        />
    );
}
