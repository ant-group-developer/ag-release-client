import { Button, ButtonProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {} & ButtonProps;

function SubmitButton({ ...props }: Props) {
    const messages = useTranslations();
    return (
        <Button type="primary" {...props}>
            {messages('common.submit')}
        </Button>
    );
}

export default SubmitButton;
