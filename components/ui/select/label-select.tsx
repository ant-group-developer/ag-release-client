import useModalStore from '@/hooks/use-modal';
import { useGetListLabels } from '@/modules/labels/hooks/use-get-list-labels';
import { LabelData } from '@/modules/labels/types';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {
    onCreateLabel?: () => void;
    fallBack?: string;
};

export default function LabelSelect({
    onCreateLabel,
    fallBack,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { labelsData } = useGetListLabels({});

    const option = labelsData.items.map((item: LabelData) => {
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
            options={option}
            labelRender={labelRender}
            dropdownRender={(menu) => {
                return (
                    <div>
                        {menu}
                        <div className="flex w-full pt-2">
                            <Button
                                type="primary"
                                className="w-full"
                                onClick={onCreateLabel}
                            >
                                {messages('common.create')} label
                            </Button>
                        </div>
                    </div>
                );
            }}
        />
    );
}
