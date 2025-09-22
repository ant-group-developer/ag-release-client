import { SIZE_ICON } from '@/constants/common';
import { Button, Divider, Input, InputRef, Select, SelectProps } from 'antd';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';

type Props = SelectProps & {};

export default function TagSelect({ onChange, value, ...props }: Props) {
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<string[]>([]);

    const inputRef = useRef<InputRef>(null);
    const messages = useTranslations();
    // const { keywordsData, isFetching } = useGetListKeywords();

    const addItem = (e: any) => {
        e.preventDefault();
        const newItem = inputValue.trim();
        if (!newItem) return;

        // thêm item mới và chọn luôn
        const newValue = [...(value || []), newItem];
        onChange?.(newValue);
        if (!options.includes(newItem)) {
            setOptions((prev) => [...prev, newItem]);
        }

        setInputValue('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    // useEffect(() => {
    //     setOptions(keywordsData || []);
    // }, [keywordsData]);

    return (
        <Select
            className="w-full"
            mode="multiple"
            placeholder={messages('common.keyword')}
            value={value}
            allowClear
            onChange={onChange}
            // loading={isFetching}
            {...props}
            dropdownRender={(menu) => (
                <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <div className="flex w-full gap-1 p-2">
                        <Input
                            onPressEnter={(e) => addItem(e)}
                            placeholder={messages('common.keyword')}
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                        <Button
                            type="default"
                            icon={
                                <div>
                                    <Plus size={SIZE_ICON} />
                                </div>
                            }
                            onClick={addItem}
                        >
                            {messages('action.create.button')}
                        </Button>
                    </div>
                </>
            )}
            options={options?.map((item: string) => ({
                label: item,
                value: item,
            }))}
        />
    );
}
