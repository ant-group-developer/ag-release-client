import { getNameByLocale, toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleIssue } from '@/modules/issues/hooks/use-get-simple-list';
import { Select, SelectProps } from 'antd';
import { useLocale } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function IssueSelect({ fallBack, ...props }: Props) {
    const { issueSimpleData } = useGetListSimpleIssue();
    const locale = useLocale();

    const options = issueSimpleData.map((item) => ({
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
