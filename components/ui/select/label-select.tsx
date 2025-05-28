import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_LABEL } from '@/modules/labels/enum';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {};

export default function LabelSelect({ ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const fakeLabel = [
        {
            id: 1,
            value: 'AMG1',
            label: 'AMG1',
        },
        {
            id: 2,
            value: 'AMG2',
            label: 'AMG2',
        },
        {
            id: 3,
            value: 'AMG3',
            label: 'AMG3',
        },
    ];
    return (
        <Select
            {...props}
            options={fakeLabel}
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
