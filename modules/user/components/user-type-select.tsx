import { cn } from '@/helpers/common';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { USER_TYPE } from '../enums';

interface Props extends SelectProps {}

function UserTypeSelect({ className, ...props }: Props) {
    const messages = useTranslations();

    const options = [
        { label: messages('user.admin'), value: USER_TYPE.ADMIN },
        { label: messages('user.user'), value: USER_TYPE.USER },
    ];
    return (
        <Select
            className={cn('w-full', className)}
            placeholder={messages('user.type')}
            {...props}
            options={options}
        />
    );
}

export default UserTypeSelect;
