import { PlusOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
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
            icon={<PlusOutlined />}
            type="primary"
            className="flex items-center justify-center"
        >
            {text ?? messages('action.create.button')}
        </Button>
    );
}

export default CreateButton;
