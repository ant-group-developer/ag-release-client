import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { cn } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { Select, SelectProps, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { USER_ORDER_BY } from '../enums';
import { useUserList } from '../hooks/use-get-user';

type Props = {
    getEmail?: boolean;
    externalOnChange?: SelectProps['onChange'];
} & SelectProps;

function UserSelect({
    getEmail,
    className,
    externalOnChange,
    ...props
}: Props) {
    const messages = useTranslations();

    const { data: dataUser } = useUserList({
        fieldOrder: USER_ORDER_BY.EMAIL,
        orderBy: ORDER.ASC,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

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
                label: email,
                string: name + ' ' + email,
                email,
                name,
            };
        });

    const handleChange: SelectProps['onChange'] = (value, option) => {
        props.onChange?.(value, option);
        externalOnChange?.(value, option);
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
            optionRender={({ data }) => (
                <div>
                    <p className="truncate">{data.name}</p>
                    <Typography.Text type="secondary">
                        {data.email}
                    </Typography.Text>
                </div>
            )}
        />
    );
}

export default UserSelect;
