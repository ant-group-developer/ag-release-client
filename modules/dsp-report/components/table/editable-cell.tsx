import { Form, Input, Select } from 'antd';
import { FieldMapping } from '../../types';

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text' | 'select';
    options?: { label: string; value: string }[];
    record: FieldMapping;
    index: number;
    children: React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    options,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode =
        inputType === 'select' ? (
            <Select
                size="small"
                options={options}
                showSearch
                optionFilterProp="label"
                className="w-full"
            />
        ) : (
            <Input size="small" />
        );

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message:
                                inputType === 'select'
                                    ? `Vui lòng chọn ${title}!`
                                    : `Vui lòng nhập ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
