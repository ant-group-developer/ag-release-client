import { useMemo } from 'react';
import { Select, SelectProps } from 'antd';
import { toNonAccentVietnamese } from '@/helpers/string';
import { GENRE_SCOPE } from '@/modules/genres/enums';
import { useGetListSimpleGenres } from '@/modules/genres/hooks/use-get-list-simple-genres';

type Props = Omit<SelectProps, 'options' | 'scope'> & {
    fallBack?: string;
};

export default function GenresVideoSelect({ fallBack, ...props }: Props) {
    const { genresData } = useGetListSimpleGenres();

    const options = useMemo(() => {
        if (!genresData) return [];

        const filtered = genresData.filter(
            (item) =>
                item.scope === GENRE_SCOPE.VIDEO ||
                item.scope === GENRE_SCOPE.BOTH
        );

        const optionList = filtered.map((item) => ({
            id: item.id,
            value: item.id,
            label: item.name,
        }));

        if (!props.value) return optionList;

        const currentValues = Array.isArray(props.value)
            ? props.value
            : [props.value];

        currentValues.forEach((val) => {
            const rawValue =
                typeof val === 'object' && val !== null
                    ? (val as any).value
                    : val;

            if (
                rawValue !== undefined &&
                rawValue !== null &&
                rawValue !== ''
            ) {
                const existsInOptions = optionList.some(
                    (opt) => opt.value === rawValue
                );
                if (!existsInOptions) {
                    const foundInGenresData = genresData.find(
                        (item) => item.id === rawValue
                    );
                    if (foundInGenresData) {
                        optionList.push({
                            id: foundInGenresData.id,
                            value: foundInGenresData.id,
                            label: foundInGenresData.name,
                        });
                    }
                }
            }
        });

        return optionList;
    }, [genresData, props.value]);

    const labelRender = (labelProps: any) => {
        const { value, label } = labelProps;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            {...props}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(String(option?.label ?? ''))
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={options}
            labelRender={labelRender}
        />
    );
}
