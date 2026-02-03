import { Input, InputProps } from 'antd';

type Props = InputProps & {};

export default function InputNumber({ ...props }: Props) {
    return (
        <Input
            allowClear
            {...props}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            onKeyPress={(e) => {
                if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                }
            }}
            onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/[^0-9]/g, '');
            }}
        />
    );
}
