import SeeMoreButton from '@/components/ui/button/see-more-button';
import { useTranslations } from 'next-intl';
import CardNews from '../card/card-news';
type Props = {};

export default function ListNews({}: Props) {
    const messages = useTranslations();

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between pb-2">
                <p className="text-lg font-bold">
                    {messages('dashboard.latestNews')}
                </p>
                <SeeMoreButton />
            </div>
            <div className="grid grid-cols-5 gap-5">
                {[].map((item, index) => (
                    <CardNews key={index} data={item} />
                ))}
            </div>
        </div>
    );
}
