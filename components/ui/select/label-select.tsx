import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_LABEL } from '@/modules/labels/enum';
import { useGetListLabels } from '@/modules/labels/hooks/use-get-list-labels';
import { LabelData } from '@/modules/labels/types';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {};

export default function LabelSelect({ ...props }: Props) {
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
                        <div className="flex justify-end pt-2">
                            <Button
                                type="primary"
                                onClick={() =>
                                    openModal(TYPE_MODAL_LABEL.CREATE)
                                }
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
