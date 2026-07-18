import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { toNonAccentVietnamese } from '@/helpers/string';
import { Avatar, Select, SelectProps, Space } from 'antd';
import { useGetListPgDspsSync } from '../../hooks/use-get-list-pg-dsps-sync';
import { PgDspsSyncData } from '../../types';

type Props = SelectProps & {
    fallBack?: string;
};

export default function PgDspsSyncSelect({ fallBack, ...props }: Props) {
    const { pgDspsSyncData, isFetching } = useGetListPgDspsSync({
        page: 1,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });

    const options = pgDspsSyncData?.map((item: PgDspsSyncData) => ({
        id: item?.pgUuid,
        value: item?.pgUuid,
        name: item?.dspName,
        dspCode: item?.dspCode,
        label: (
            <Space>
                <Avatar src={item?.picture} size="small" />
                <span>{item?.dspName}</span>
            </Space>
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
            labelRender={labelRender}
            {...props}
            loading={isFetching}
            showSearch
            filterOption={(input, option) => {
                const searchValue = `${option?.name ?? ''} ${
                    option?.dspCode ?? ''
                }`;

                return toNonAccentVietnamese(searchValue)
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase());
            }}
            options={options}
        />
    );
}
