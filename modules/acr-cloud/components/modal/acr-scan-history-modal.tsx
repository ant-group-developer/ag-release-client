import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';

type Props = Omit<AppModalProps, 'children'> & {};

export default function AcrCloudScanHistoryModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);

    const handleSubmit = (values: any) => {};

    return (
        <AppModal
            open
            title={`${messages('common.history')} ${messages('common.scan').toLowerCase()}  ACRCloud`}
            onCancel={closeModal}
            width={750}
            footer={null}
            {...props}
        ></AppModal>
    );
}
