import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { getNameByLocale, toNonAccentVietnamese } from '@/helpers/string';
import { useGetListNewsCategory } from '@/modules/news-category/hooks/use-get-list';
import { Select, SelectProps } from 'antd';
import { useLocale } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function NewsCategorySelect({ fallBack, ...props }: Props) {
    const { newsCategoryData } = useGetListNewsCategory({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
    const locale = useLocale();

    const options = newsCategoryData?.items?.map((item) => ({
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
