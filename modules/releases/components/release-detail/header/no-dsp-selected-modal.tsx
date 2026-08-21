import AppModal from '@/components/ui/modal/normal-modal';
import { SIZE_ICON_BIG } from '@/constants/common';
import { Button, Space, Typography } from 'antd';
import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    open: boolean;
    onCancel: () => void;
    onGoToDistribution: () => void;
};

export default function NoDspSelectedModal({
    open,
    onCancel,
    onGoToDistribution,
}: Props) {
    const messages = useTranslations();

    return (
        <AppModal
            open={open}
            onCancel={onCancel}
            title={
                <div className="flex items-center gap-2">
                    <CircleAlert size={SIZE_ICON_BIG} className="text-amber-500" />
                    <Typography.Text strong>
                        {messages('distribute.noDspSelectedTitle')}
                    </Typography.Text>
                </div>
            }
            footer={
                <div className="flex justify-end gap-2">
                    <Button onClick={onCancel}>
                        {messages('common.close')}
                    </Button>
                    <Button type="primary" onClick={onGoToDistribution}>
                        {messages('distribute.goToDistribution')}
                    </Button>
                </div>
            }
        >
            <div className="py-2">
                <Typography.Paragraph className="!mb-0 text-base">
                    {messages('distribute.noDspSelectedMessage')}
                </Typography.Paragraph>
            </div>
        </AppModal>
    );
}
