import { SIZE_ICON } from '@/constants/common';
import { Tooltip } from 'antd';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ButtonHTMLAttributes } from 'react';

type Props = {
    showTooltip?: boolean;
    canDelete?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function DeleteButton({ showTooltip = true, canDelete, ...props }: Props) {
    const messages = useTranslations();

    if (!canDelete) return null;

    if (showTooltip) {
        return (
            <Tooltip title={messages('common.delete')}>
                <button
                    {...props}
                    className="rounded-full border-0 bg-inherit p-2"
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = '#fee2e2')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = '')
                    }
                >
                    <Trash size={SIZE_ICON} color="red" />
                </button>
            </Tooltip>
        );
    }
    return (
        <button {...props}>
            <button
                {...props}
                className="rounded-full border-0 bg-inherit p-2"
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#fee2e2')
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '')
                }
            >
                <Trash size={16} color="red" />
            </button>
        </button>
    );
}

export default DeleteButton;
