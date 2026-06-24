import { SIZE_ICON } from '@/constants/common';
import { Tooltip } from 'antd';
import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ButtonHTMLAttributes } from 'react';

type Props = {
    canUpdate?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function UpdateButton({ canUpdate, ...props }: Props) {
    const messages = useTranslations();

    if (!canUpdate) return null;

    return (
        <Tooltip title={messages('common.update')}>
            <button
                type="button"
                {...props}
                className="rounded-full border-0 bg-inherit p-2 hover:bg-slate-200"
            >
                <Pencil size={SIZE_ICON} />
            </button>
        </Tooltip>
    );
}

export default UpdateButton;
