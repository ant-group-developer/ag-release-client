import SeeMoreButton from '@/components/ui/button/see-more-button';
import { NewsData } from '@/modules/news/types';
import { useTranslations } from 'next-intl';
import CardNews from '../card/card-news';
type Props = {};

export default function ListNews({}: Props) {
    const messages = useTranslations();
    const listNews: NewsData[] = [
        {
            id: 1,
            title: 'Meet Revelator at Music Biz 2025: Breaking Borders & Building Global Strategies',
            description: '',
            image: 'https://cms.revelator.com/assets/c0ec4b68-0f55-4e10-aee1-ed6eedb2ffb8',
            date: 'May 6, 2025',
        },
        {
            id: 2,
            title: 'Stay Ahead: DSP & UGC Platforms Updates April 2025',
            description: '',
            image: 'https://cms.revelator.com/assets/e3dea3e8-0a57-4e41-b9ee-23f6d326ee4a',
            date: 'May 6, 2025',
        },
        {
            id: 3,
            title: 'Music on WhatsApp Status and Channels',
            description: '',
            image: 'https://cms.revelator.com/assets/7c61ccd7-5332-40d3-a78e-0cfae4766676',
            date: 'May 6, 2025',
        },
        {
            id: 4,
            title: 'Meet Chordal: Now in the Revelator Pro Marketplace',
            description: '',
            image: 'https://cms.revelator.com/assets/3c43b946-82e8-43fa-8fc0-dc923cba0302',
            date: 'May 6, 2025',
        },
        {
            id: 5,
            title: 'Meet Chordal: Now in the Revelator Pro Marketplace',
            description: '',
            image: 'https://cms.revelator.com/assets/3c43b946-82e8-43fa-8fc0-dc923cba0302',
            date: 'May 6, 2025',
        },
    ];

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between pb-2">
                <p className="text-lg font-bold">
                    {messages('dashboard.latestNews')}
                </p>
                <SeeMoreButton />
            </div>
            <div className="grid grid-cols-5 gap-5">
                {listNews.map((item, index) => (
                    <CardNews key={index} data={item} />
                ))}
            </div>
        </div>
    );
}
