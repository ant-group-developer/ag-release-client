import { cn } from '@/helpers/tailwind';
import { Input, InputProps } from 'antd';
import _ from 'lodash';
import { useTranslations } from 'next-intl';
import { ChangeEventHandler } from 'react';

export type OnSearchType = ChangeEventHandler<HTMLInputElement>;

export type AppSearchProps = {
    onChange?: ChangeEventHandler<HTMLInputElement>;
    wrapperClassName?: string;
    delay?: number;
    onSearch?: (value: string) => void;
} & InputProps;

export default function AppSearch({
    onChange = () => {},
    wrapperClassName,
    delay = 800,
    onSearch,
    ...props
}: AppSearchProps) {
    const messages = useTranslations();

    const debounceSearchChange = _.debounce(onChange, delay);
    return (
        <div className={cn('flex w-full items-center', wrapperClassName)}>
            <Input.Search
                // prefix={<Search size={SIZE_ICON} />}
                id={props.defaultValue?.toString() ?? Math.random().toString()}
                onChange={(e) => debounceSearchChange(e)}
                placeholder={messages('form.searchPlaceholder')}
                allowClear
                onSearch={onSearch}
                {...props}
            />
        </div>
    );
}
