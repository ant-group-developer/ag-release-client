import { formattedNumber } from '@/helpers/common';
import { Card } from 'antd';
import { useTranslations } from 'next-intl';
import { IssueCountData } from '../../types';

type Props = {
    dataSource: IssueCountData[];
    className?: string;
};

const colors = ['#6366f1', '#3b82f6', '#a855f7', '#ef4444'];

const fakeData: IssueCountData[] = [
    { id: '1', nameEn: 'Copyright Claims', total: 32 },
    { id: '2', nameEn: 'Metadata Fixes', total: 12 },
    { id: '3', nameEn: 'Audio Quality', total: 33 },
    { id: '4', nameEn: 'Artwork Issues', total: 12 },
];

export default function IssueStats({ dataSource, className }: Props) {
    const displayData = (dataSource?.length > 0 ? dataSource : fakeData).slice(
        0,
        4
    );
    const messages = useTranslations();

    return (
        <Card
            className={`overflow-hidden rounded-3xl border-0 shadow-sm ${className}`}
            styles={{ body: { padding: '24px' } }}
        >
            <h3 className="mb-1 text-lg font-bold">{'Issues'}</h3>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
                {displayData.map((item, index) => {
                    const color = colors[index % colors.length];

                    return (
                        <div
                            key={item.id || index}
                            className="flex flex-col items-center justify-center text-center"
                        >
                            <div className="mb-2 text-xs font-medium text-gray-400">
                                {item.nameEn}
                            </div>
                            <div
                                className="text-3xl font-bold tracking-tight"
                                style={{ color }}
                            >
                                {formattedNumber(item.total)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
