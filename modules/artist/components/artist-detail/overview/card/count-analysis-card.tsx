import AppCard from '@/components/ant-music/app-card';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    number: number;
    title: string;
    onClickButton?: () => void;
};

export default function CountAnalysisCard({
    title,
    number,
    onClickButton,
}: Props) {
    const messages = useTranslations();
    return (
        <AppCard title={title}>
            <div className="flex flex-1 flex-col justify-between">
                <div className="py-10 text-4xl">{number}</div>
                <div>
                    <Button shape="round" onClick={onClickButton}>
                        {messages('common.seeMore')}
                    </Button>
                </div>
            </div>
        </AppCard>
    );
}
