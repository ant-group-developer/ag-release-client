import { Button, ButtonProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = ButtonProps & {};

export default function SeeMoreButton({ ...props }: Props) {
    const messages = useTranslations();
    return (
        <Button
            type="text"
            className="!rounded-2xl !bg-card-bg hover:!bg-card-bg-hover"
            {...props}
        >
            {messages('common.seeMore')}
        </Button>
    );
}
