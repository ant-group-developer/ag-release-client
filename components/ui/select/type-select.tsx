import AppSelect from '@/components/ui/select/nomal-select';
import { LOCALE } from '@/enums/common';
import { useGetProductTypes } from '@/modules/product-types/hooks/use-get-product-types';
import { SelectProps } from 'antd';
import { useLocale } from 'next-intl';

interface Props extends SelectProps {
    showVideoAndImage?: boolean;
}

export default function TypeSelect({
    showVideoAndImage = true,
    ...props
}: Props) {
    const locale = useLocale();
    const { productTypesData } = useGetProductTypes();

    const typeOptions = productTypesData.items.map((item) => ({
        value: item.id,
        label: locale === LOCALE.EN ? item.nameEn : item.nameVi,
    }));

    return <AppSelect {...props} options={typeOptions} />;
}
