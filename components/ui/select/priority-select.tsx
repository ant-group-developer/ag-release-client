import AppSelect from '@/components/ui/select/nomal-select';
import { LOCALE } from '@/enums/common';
import { useGetPriorityList } from '@/modules/priorities/hooks/use-get-priority';
import { Badge, SelectProps } from 'antd';
import { useLocale } from 'next-intl';

interface Props extends SelectProps {
    fallback?: string;
}

export default function PrioritySelect({ fallback, ...props }: Props) {
    const locale = useLocale();
    const { priorityData, isLoading } = useGetPriorityList();
    const priorityOptions = priorityData.items.map((item) => ({
        value: item.id,
        label: (
            <div className="flex items-center gap-2">
                <Badge color={item.color} />
                <span>{locale === LOCALE.EN ? item.nameEn : item.nameVi}</span>
            </div>
        ),
        title: locale === LOCALE.EN ? item.nameEn : item.nameVi,
    }));

    const labelRender = (props: any) => {
        const { value, title } = props;

        if (value) {
            return title || fallback || value;
        }
        return undefined;
    };

    return (
        <AppSelect
            loading={isLoading}
            {...props}
            options={priorityOptions}
            labelRender={labelRender}
        />
    );
}
