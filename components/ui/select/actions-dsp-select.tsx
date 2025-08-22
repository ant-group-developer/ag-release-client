import { toNonAccentVietnamese } from '@/helpers/string';
import { ActionsData } from '@/modules/actions/types';
import { useGetListDspActionByDspId } from '@/modules/dsp-action/hooks/use-get-list-dsp-action-by-id';
import { Select, SelectProps } from 'antd';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
    dspId?: string;
};

export default function ActionsDspSelect({ dspId, fallBack, ...props }: Props) {
    const { dspActionsData } = useGetListDspActionByDspId(dspId as string);

    const actions = dspActionsData?.map((item) => item.action) ?? [];

    const options = actions?.map((item: ActionsData) => ({
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
            labelRender={labelRender}
            {...props}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={options}
        />
    );
}
