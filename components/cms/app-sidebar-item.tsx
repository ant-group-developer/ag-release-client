import { formattedNumber } from '@/helpers/common';
import { useLocale } from '@/hooks/use-locale';
import { Checkbox } from 'antd';

type Props = {
    data: {
        name: string;
        value: string | number;
        count: number;
    };
};

function AppSidebarItem({ data }: Props) {
    const { name, value, count } = data;
    const { locale } = useLocale();
    return (
        <Checkbox value={value} disabled={!count}>
            <div className="flex items-center justify-between gap-1">
                <p className="grow truncate" title={name}>
                    {name}
                </p>
                <p className="">{formattedNumber(count, locale)}</p>
            </div>
        </Checkbox>
    );
}

export default AppSidebarItem;
