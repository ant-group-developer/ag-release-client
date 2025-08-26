import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useTranslations } from 'next-intl';

type Props = Omit<AppModalProps, 'children'> & {};

export default function AcrResultCompareModal({ ...props }: Props) {
    const messages = useTranslations();

    return (
        <AppModal
            title={`Compare`}
            onCancel={() => {}}
            width={750}
            footer={false}
            {...props}
        >
            Compare
        </AppModal>
    );
}
