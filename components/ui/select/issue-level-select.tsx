import { getNameByLocale, toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleIssueLevel } from '@/modules/issue-level/hooks/use-get-simple-list';
import { Select, SelectProps } from 'antd';
import { useLocale } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function IssueLevelSelect({ fallBack, ...props }: Props) {
    const { issueLevelSimpleData } = useGetListSimpleIssueLevel();
    const locale = useLocale();

    const options = issueLevelSimpleData.map((item) => ({
        id: item.id,
        value: item.id,
        name: getNameByLocale(item?.nameEn, item?.nameVi, locale),
        label: (
            <p className="flex items-center justify-between gap-1">
                <span>
                    {getNameByLocale(item?.nameEn, item?.nameVi, locale)}
                </span>
            </p>
        ),
    }));

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
