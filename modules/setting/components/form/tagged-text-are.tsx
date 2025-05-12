import { SIZE_ICON } from '@/constants/common';
import UserSelect from '@/modules/user/components/user-select';
import { Tag } from 'antd';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TaggedInputProps {
    value?: string;
    onChange?: (value: string) => void;
}

const TaggedInput = ({ value, onChange }: TaggedInputProps) => {
    const [tags, setTags] = useState<string[]>([]);

    // Convert initial string value to tags array
    useEffect(() => {
        if (value) {
            setTags(value.split(',').filter((tag) => tag.trim() !== ''));
        } else {
            setTags([]);
        }
    }, [value]);

    const handleClose = (removedTag: string) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
        onChange?.(newTags.join(','));
    };

    const handleSelect = (selectedValue: string) => {
        if (selectedValue && !tags.includes(selectedValue)) {
            const newTags = [...tags, selectedValue];
            setTags(newTags);
            onChange?.(newTags.join(','));
        }
    };

    return (
        <div className="rounded-md border p-2">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                    <Tag
                        key={tag}
                        closable
                        closeIcon={<X size={SIZE_ICON} />}
                        onClose={() => handleClose(tag)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            margin: 0,
                            maxWidth: '100%',
                        }}
                    >
                        {tag}
                    </Tag>
                ))}
                <UserSelect
                    size="small"
                    className="max-w-44"
                    allowClear={true}
                    disabled={false}
                    value={undefined}
                    fallback={undefined}
                    onChange={handleSelect}
                />
            </div>
        </div>
    );
};
export default TaggedInput;
