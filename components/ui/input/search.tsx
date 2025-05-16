import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/tailwind';
import { Input, InputProps } from 'antd';
import _ from 'lodash';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ChangeEventHandler } from 'react';

export type OnSearchType = ChangeEventHandler<HTMLInputElement>;

type Props = {
    onChange?: OnSearchType;
    wrapperClassName?: string;
    delay?: number;
} & InputProps;

export default function AppSearch({
    onChange = () => {},
    wrapperClassName,
    delay = 300,
    ...props
}: Props) {
    const messages = useTranslations();

    const debounceSearchChange = _.debounce(onChange, delay);
    return (
        <div className={cn('w-full', wrapperClassName)}>
            <Input
                prefix={<Search size={SIZE_ICON} />}
                id={props.defaultValue?.toString() ?? Math.random().toString()}
                onChange={(e) => debounceSearchChange(e)}
                placeholder={messages('form.searchPlaceholder')}
                allowClear
                {...props}
            />
        </div>
    );
}
