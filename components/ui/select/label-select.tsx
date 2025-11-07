import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListLabelsSimple } from '@/modules/labels/hooks/use-get-list-simple-labels';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {
    onCreateLabel?: () => void;
    fallBack?: string;
    showCreate?: boolean;
};

export default function LabelSelect({
    onCreateLabel,
    fallBack,
    showCreate = false,
    ...props
}: Props) {
    const messages = useTranslations();

    const { labelsData } = useGetListLabelsSimple();

    const option = labelsData?.map((item) => {
        return {
            id: item.id,
            value: item.id,
            label: item.name,
        };
    });

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
                toNonAccentVietnamese(option?.label ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={option}
            labelRender={labelRender}
            dropdownRender={(menu) => {
                return (
                    <div>
                        {menu}
                        {showCreate && (
                            <div className="flex w-full pt-2">
                                <Button
                                    type="primary"
                                    className="w-full"
                                    onClick={onCreateLabel}
                                >
                                    {messages('common.create')} label
                                </Button>
                            </div>
                        )}
                    </div>
                );
            }}
        />
    );
}
