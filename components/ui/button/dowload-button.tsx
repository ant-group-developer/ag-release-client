import { SIZE_ICON } from '@/constants/common';
import { Button, ButtonProps } from 'antd';
import { Download } from 'lucide-react';
import { ReactNode } from 'react';

interface Props extends ButtonProps {
    value: string;
    icon?: ReactNode;
}

export default function DowloadButton({ value, icon, ...props }: Props) {
    return (
        <Button
            {...props}
            type="primary"
            icon={icon || <Download size={SIZE_ICON} />}
        >
            {value}
        </Button>
    );
}
