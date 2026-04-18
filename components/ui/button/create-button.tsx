import { PlusOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    canCreate?: boolean;
    text?: string;
} & ButtonProps;

function CreateButton({ text, canCreate = true, ...props }: Props) {
    const messages = useTranslations();
    if (!canCreate) return null;
    return (
        <Button
            icon={<PlusOutlined />}
            type="primary"
            {...props}
            className="flex items-center justify-center"
        >
            {text ?? messages('action.create.button')}
        </Button>
    );
}

export default CreateButton;
