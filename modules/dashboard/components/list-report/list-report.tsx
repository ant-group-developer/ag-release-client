import ImageFallback from '@/components/ui/image/image-fallback';
import { Select, SelectProps, theme } from 'antd';
import { useTranslations } from 'next-intl';

type ListItem = {
    name: string;
    value: number;
    percent: string;
    image?: string;
};

type Props = {
    data?: ListItem[];
    title?: string;
};

const defaultData: ListItem[] = [
    { name: 'Thurri', value: 5856, percent: '+55%' },
    { name: 'Spotify', value: 2602, percent: '+25%' },
    { name: 'Resso', value: 1802, percent: '+15%' },
    { name: 'Other', value: 1105, percent: '+5%' },
];

export default function ListReport({
    data = defaultData,
    title = 'Revenue Report',
}: Props) {
    const { token } = theme.useToken();
    const messages = useTranslations();
    const options: SelectProps['options'] = [
        {
            label: messages('country.label'),
            value: 'country',
        },
        {
            label: messages('common.platforms'),
            value: 'dsp',
        },
    ];

    return (
        <div
            style={{
                borderColor: token.colorBorder,
            }}
            className="flex h-full w-full flex-col rounded-lg border p-6 shadow"
        >
            <div className="mb-4 flex items-center justify-between">
                <span className="text-lg font-semibold">{title}</span>
                <Select
                    className="min-w-44"
                    options={options}
                    placeholder="Select report"
                />
            </div>
            <div className="flex-1">
                <div className="divide-y divide-gray-200">
                    {data.map((item, idx) => (
                        <div key={item.name} className="flex items-center py-2">
                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                <div className="h-8 overflow-hidden rounded-full">
                                    <ImageFallback
                                        src={item?.image ?? ''}
                                        alt=""
                                        width={32}
                                        height={32}
                                    />
                                </div>
                                <span className="truncate">{item.name}</span>
                            </div>
                            <div className="w-36 text-left">
                                <span className="font-medium">
                                    ${item.value}
                                </span>
                            </div>
                            <div className="w-14 text-right">
                                <span className="font-semibold text-green-700">
                                    {item.percent}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
