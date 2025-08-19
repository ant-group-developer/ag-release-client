import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListActions } from '@/modules/actions/hooks/use-get-list-actions';
import { ActionsData } from '@/modules/actions/types';
import { Select, SelectProps } from 'antd';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function ActionsSelect({ fallBack, ...props }: Props) {
    const { actionsData } = useGetListActions({
        pageSize: 999,
    });

    const options = actionsData.items.map((item: ActionsData) => ({
        id: item.id,
        value: item.id,
        name: item?.name,
        label: (
            <p className="flex items-center justify-between gap-1">
                <span>{item?.name}</span>
                <IconInfoTooltip title={item.note} />
            </p>
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
            {...props}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={options}
            labelRender={labelRender}
        />
    );
}
