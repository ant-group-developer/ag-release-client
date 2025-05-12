import AppSelect from '@/components/ui/select/nomal-select';
import { PRODUCT_TYPE } from '@/modules/product/enums';
import { SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

interface Props extends SelectProps {}

export default function TypeOrderProductSelect({ ...props }: Props) {
    const messages = useTranslations();
    // const typeOptions = [
    //     { value: UPLOAD_TYPE.IMAGE, label: messages('common.image') },
    //     { value: UPLOAD_TYPE.VIDEO, label: messages('common.video') },
    //     { value: UPLOAD_TYPE.SOURCE, label: messages('common.source') },
    // ];
    const typeOptions = Object.values(PRODUCT_TYPE).map((item) => ({
        value: item,
        label: messages(`common.${item}`),
    }));

    return <AppSelect {...props} options={typeOptions} />;
}
