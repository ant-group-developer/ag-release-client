import { UPLOAD_TYPE } from '@/enums/common';
import { formattedNumber, getIntlCodeByTypeUpload } from '@/helpers/common';
import { TypeCountData } from '@/modules/order/types';
import { Empty, Radio, RadioProps } from 'antd';
import { useTranslations } from 'next-intl';

interface Props extends RadioProps {
    showVideoAndImage?: boolean;
    optionsData: TypeCountData[];
}

export default function TypeRadio({
    showVideoAndImage = true,
    optionsData,
    ...props
}: Props) {
    const messages = useTranslations();

    // Tạo một mảng để lưu trữ các tùy chọn
    let typeOptions: { value: string; label: React.ReactNode }[] = [];

    // Nếu có dữ liệu từ API, sử dụng nó
    if (optionsData && optionsData.length > 0) {
        typeOptions = optionsData
            .filter((item) => {
                return !(item.count === 0) && item.name;
            })
            .map((item) => {
                const typeNameTranslate = messages(
                    getIntlCodeByTypeUpload(item.name as UPLOAD_TYPE)
                );

                return {
                    value: item.name,
                    label: (
                        <div className="flex w-[160px] justify-between">
                            <span className="truncate">
                                {typeNameTranslate}{' '}
                            </span>
                            <span>{formattedNumber(item.count)}</span>
                        </div>
                    ),
                };
            });
    }

    if (typeOptions.length === 0) return <Empty />;
    return <Radio.Group className="w-full" {...props} options={typeOptions} />;
}
