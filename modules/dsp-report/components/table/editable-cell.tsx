import { Form, Input } from 'antd';
import { FieldMapping } from '../../types';

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'text';
    record: FieldMapping;
    index: number;
    children: React.ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng nhập ${title}!`,
                        },
                    ]}
                >
                    <Input size="small" />
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
