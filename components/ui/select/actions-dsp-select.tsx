import { toNonAccentVietnamese } from '@/helpers/string';
import { DspActionData } from '@/modules/dsp-action/types';
import { Select, SelectProps } from 'antd';
import IconInfoTooltip from '../tooltip/icon-info-tooltip';

type Props = SelectProps & {
    fallBack?: string;
    dspId?: string;
    actions: DspActionData[];
};

export default function ActionsDspSelect({
    actions,
    dspId,
    fallBack,
    ...props
}: Props) {
    // const { dspActionsData } = useGetListDspActionByDspId(dspId as string);

    // const actions = dspActionsData?.map((item) => item.action) ?? [];

    const options = actions?.map((item: DspActionData) => ({
        id: item?.action?.id,
        value: item?.action?.id,
        name: item?.action?.name,
        label: (
            <p className="flex items-center justify-between gap-1">
                <span>{item?.action?.name}</span>
                {item?.action?.note && (
                    <IconInfoTooltip title={item?.action?.note} />
                )}
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
