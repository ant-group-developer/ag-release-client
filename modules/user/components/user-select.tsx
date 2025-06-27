import { cn } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useUserList } from '../hooks/use-get-user';

type Props = {
    getEmail?: boolean;
    externalOnChange?: SelectProps['onChange'];
    fallback?: string;
} & SelectProps;

function UserSelect({
    getEmail,
    className,
    externalOnChange,
    fallback,
    ...props
}: Props) {
    const messages = useTranslations();
    const defaultUserList = {
        page: 1,
        pageSize: 999,
    };

    const { data: dataUser } = useUserList(defaultUserList);

    const options = dataUser.items
        // .toSorted((a, b) => a.department.name.localeCompare(b.department.name))
        .map((data: any) => {
            // const firstName = data.firstname;
            // const lastName = data.lastname;
            // const userName = `${firstName} ${lastName}`;
            const userId = data.id;
            // const department = data.department.name || '';
            const email = data.email;
            const name = data.name;

            return {
                value: getEmail ? email : userId,
                label: (
                    <p className="flex flex-col">
                        <span className="truncate">{name}</span>
                        <span className="truncate text-gray-400">{email}</span>
                    </p>
                ),
                string: name + ' ' + email,
                // string: email,
                email,
                name,
                title: name,
            };
        });

    const handleChange: SelectProps['onChange'] = (value, option) => {
        props.onChange?.(value, option);
        externalOnChange?.(value, option);
    };

    const labelRender = (props: any) => {
        const { value, title } = props;

        if (value) {
            return title || fallback || value;
        }
        return undefined;
    };

    return (
        <Select
            placeholder={messages('user.select')}
            showSearch
            className={cn('w-full', className)}
            {...props}
            onChange={handleChange}
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.string ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={options}
            labelRender={labelRender}
        />
    );
}

export default UserSelect;
