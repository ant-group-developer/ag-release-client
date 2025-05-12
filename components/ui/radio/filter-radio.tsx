import { formattedNumber } from '@/helpers/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useLocale } from '@/hooks/use-locale';
import { Radio, RadioProps } from 'antd';
import Highlighter from 'react-highlight-words';

type Props = {
    data: {
        name: string;
        value: string | number;
        count: number;
    }[];
    searchWords?: string;
} & RadioProps;

function RadioComponent({ data, searchWords, ...props }: Props) {
    const { locale } = useLocale();
    if (data?.length < 1) return null;
    return (
        <Radio.Group {...props} className="flex w-full flex-col">
            {data.map((item) => {
                if (item.count !== 0 && item.name)
                    return (
                        <Radio
                            key={item.value}
                            value={item.value}
                            className="m-0"
                        >
                            <div className="flex items-center gap-1">
                                <p className="ellipsis w-56" title={item.name}>
                                    {/* {item.name} */}
                                    <Highlighter
                                        highlightClassName="bg-yellow-200 font-medium"
                                        searchWords={[
                                            toNonAccentVietnamese(
                                                searchWords ?? ''
                                            ),
                                        ]}
                                        autoEscape={true}
                                        textToHighlight={item.name}
                                        caseSensitive={false}
                                        unhighlightStyle={{ padding: 0 }}
                                    />
                                </p>
                                <p className="text-right">
                                    {formattedNumber(item.count, locale)}
                                </p>
                            </div>
                        </Radio>
                    );
            })}
        </Radio.Group>
    );
}

export default RadioComponent;
