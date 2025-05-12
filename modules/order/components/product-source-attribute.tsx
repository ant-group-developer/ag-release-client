import ClipBoard from '@/components/ui/input/Clip-board';
import { Empty } from 'antd';
import { useTranslations } from 'next-intl';
import { OrderProduct } from '../types';
import AttributeItem from './attribute-item';

type Props = { sourceData: OrderProduct };

export default function ProductSourceAttribute({ sourceData }: Props) {
    const messages = useTranslations();

    if (!sourceData?.product?.source) return <Empty />;

    return (
        <div className="flex gap-24">
            <AttributeItem
                label={messages('common.userUpload')}
                value={sourceData?.product?.nameUserCreator}
            />
            {/* <AttributeItem
                label={messages('common.source')}
                value={sourceData?.product?.source}
            /> */}
            <div className="flex flex-col">
                <p className="font-bold text-gray-500">
                    {messages('common.source')}
                </p>
                {/* <a
                    href={sourceData?.product?.source}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {sourceData?.product?.source}
                </a>  */}
                <ClipBoard
                    className="!w-[550px]"
                    url={sourceData?.product?.source}
                />
            </div>
        </div>
    );
}
