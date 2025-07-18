import useModalStore from '@/hooks/use-modal';
import { useGetListLabels } from '@/modules/labels/hooks/use-get-list-labels';
import { LabelData } from '@/modules/labels/types';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {
    onCreateLabel?: () => void;
};

export default function LabelSelect({ onCreateLabel, ...props }: Props) {
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

    return (
        <Select
            {...props}
            options={option}
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
