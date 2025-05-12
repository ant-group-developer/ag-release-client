import { SIZE_ICON } from '@/constants/common';
import { Tooltip } from 'antd';
import { Eye } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ButtonHTMLAttributes } from 'react';

type Props = {
    canView?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function ViewButton({ canView, ...props }: Props) {
    const messages = useTranslations();

    if (!canView) return null;

    return (
        <Tooltip title={messages('common.detail')}>
            <button
                {...props}
                className="h-fit w-fit rounded-full border-0 bg-inherit p-2 hover:bg-slate-200"
            >
                <Eye size={SIZE_ICON} />
            </button>
        </Tooltip>
    );
}

export default ViewButton;
