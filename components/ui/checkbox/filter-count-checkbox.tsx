import { toNonAccentVietnamese } from '@/helpers/string';
import { Checkbox, Empty } from 'antd';
import { CheckboxGroupProps } from 'antd/es/checkbox';
import Highlighter from 'react-highlight-words';

interface StatusCheckboxProps extends Omit<CheckboxGroupProps, 'options'> {
    data: {
        name: string;
        value: string | number;
        // count: number;
    }[];
    searchWords?: string;
}

export default function FilterCheckbox({
    data,
    searchWords,
    ...props
}: StatusCheckboxProps) {
    // const { locale } = useLocale();
    if (data.length === 0) return <Empty />;

    return (
        <Checkbox.Group className="flex w-full flex-col" {...props}>
            {data.map((option) => (
                <div
                    key={option.value}
                    className="flex items-center justify-between"
                >
                    <Checkbox value={option.value}>
                        {/* {option.name} */}

                        {/* @ts-ignore */}
                        <Highlighter
                            highlightClassName="bg-yellow-200 font-medium"
                            searchWords={[
                                toNonAccentVietnamese(searchWords ?? ''),
                            ]}
                            autoEscape={true}
                            textToHighlight={option.name}
                            caseSensitive={false}
                            unhighlightStyle={{ padding: 0 }}
                        />
                    </Checkbox>
                    {/* <p className="text-right">
                        {formattedNumber(option.count, locale)}
                    </p> */}
                </div>
            ))}
        </Checkbox.Group>
    );
}
