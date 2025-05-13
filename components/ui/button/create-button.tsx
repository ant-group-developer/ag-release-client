import { SIZE_ICON_BUTTON } from '@/constants/common';
import { Button, ButtonProps } from 'antd';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    canCreate: boolean;
    text?: string;
} & ButtonProps;

function CreateButton({ text, canCreate, ...props }: Props) {
    const messages = useTranslations();
    if (!canCreate) return null;
    return (
        <Button
            {...props}
            icon={<PlusIcon size={SIZE_ICON_BUTTON} />}
            type="primary"
            className="flex items-center justify-center"
        >
            {text ?? messages('common.create')}
        </Button>
    );
}

export default CreateButton;
