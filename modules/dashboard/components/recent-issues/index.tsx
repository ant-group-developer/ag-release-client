import { ScrollArea } from '@/components/ui/scroll/scroll-area';
import { formattedNumber } from '@/helpers/common';
import { Card } from 'antd';
import { useTranslations } from 'next-intl';
import { IssueCountData } from '../../types';

type Props = {
    issuesData?: IssueCountData[];
    className?: string;
};

const fakeIssues: IssueCountData[] = [
    { id: '1', nameEn: 'Copyright Claims', total: 32 },
    { id: '2', nameEn: 'Metadata Fixes', total: 12 },
    { id: '3', nameEn: 'Audio Quality', total: 8 },
    { id: '4', nameEn: 'Artwork Issues', total: 12 },
    { id: '5', nameEn: 'Payment Pending', total: 5 },
    { id: '6', nameEn: 'Invalid ISRC', total: 3 },
    { id: '7', nameEn: 'Duplicate Release', total: 2 },
    { id: '8', nameEn: 'Low Resolution Cover', total: 7 },
    { id: '9', nameEn: 'Lyrics Sync Issue', total: 4 },
    { id: '10', nameEn: 'Contributor Conflict', total: 1 },
];

export default function RecentIssuesCard({ issuesData, className }: Props) {
    const messages = useTranslations();
    const data = issuesData && issuesData.length > 0 ? issuesData : fakeIssues;

    return (
        <Card
            title={
                <h3 className="m-0 text-lg font-bold text-blue-500">
                    {messages('common.issues')}
                </h3>
            }
            className={`h-full ${className}`}
            styles={{
                header: { borderBottom: 0, paddingBottom: 0, paddingTop: 24 },
                body: { padding: '24px' },
            }}
        >
            <ScrollArea className="h-[350px] pr-4">
                <div className="flex flex-col gap-4">
                    {data.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="flex items-center justify-between"
                        >
                            <span className="text-sm font-semibold">
                                {item.nameEn}
                            </span>
                            <div className="flex h-7 w-12 items-center justify-center rounded border border-red-100 bg-red-50 text-xs font-bold text-red-500">
                                {formattedNumber(item.total)}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </Card>
    );
}
