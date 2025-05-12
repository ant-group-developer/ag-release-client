import { cn } from '@/helpers/common';
import { useTranslations } from 'next-intl';
import { OrderProduct } from '../types';
import ProductImageAttribute from './product-image-attribute';
import ProductSourceAttribute from './product-source-attribute';
import ProductVideoAttribute from './product-video-attribute';

type Props = {
    className?: string;
    imageData?: OrderProduct;
    videoData?: OrderProduct;
    sourceData?: OrderProduct;
};

export default function ProductAttributes({
    className,
    imageData,
    videoData,
    sourceData,
}: Props) {
    const messages = useTranslations();

    const attributeContent = () => {
        let attributeContent;
        if (imageData) {
            attributeContent = <ProductImageAttribute imageData={imageData} />;
        } else if (videoData) {
            attributeContent = <ProductVideoAttribute videoData={videoData} />;
        } else if (sourceData) {
            attributeContent = (
                <ProductSourceAttribute sourceData={sourceData} />
            );
        } else {
            attributeContent = (
                <p className="text-gray-500">
                    {messages('common.noDataAvailable')}
                </p>
            );
        }
        return attributeContent;
    };

    return (
        <div className={cn(className)}>
            <p className="py-2 text-base font-bold">
                {messages('common.attributes')}
            </p>
            {attributeContent()}
        </div>
    );
}
