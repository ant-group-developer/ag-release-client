import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { QueryFilter, QueryFilterProps } from '@ant-design/pro-components';
import { ChevronsDown, ChevronsUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import IconButton from '../button/icon-button';

type Props = QueryFilterProps & {};

export default function AppFilter({ className, children, ...props }: Props) {
    const messages = useTranslations();
    return (
        <QueryFilter
            className={cn('rounded-md bg-white', className)}
            layout="vertical"
            span={4}
            submitter={{
                searchConfig: {
                    submitText: messages('common.search'),
                    resetText: messages('common.clearFilter'),
                },
            }}
            collapseRender={(collapsed) =>
                collapsed ? (
                    <IconButton>
                        <ChevronsDown size={SIZE_ICON} />
                    </IconButton>
                ) : (
                    <IconButton>
                        <ChevronsUp size={SIZE_ICON} />
                    </IconButton>
                )
            }
            {...props}
        >
            {children}
        </QueryFilter>
    );
}
