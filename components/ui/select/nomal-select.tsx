import { Select, SelectProps } from 'antd';
import { DefaultOptionType } from 'antd/es/select';

interface AppSelect extends SelectProps {
    width?: number | string;
    options: DefaultOptionType[];
    onChange?: (value: any) => void;
}

export default function AppSelect({ onChange, options, ...props }: AppSelect) {
    return <Select options={options} {...props} onChange={onChange} />;
}
