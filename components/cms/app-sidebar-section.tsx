import { cn } from '@/helpers/common';
import { useActive } from '@/hooks/use-active';
import { useLoading, UseLoadingType } from '@/hooks/use-loading';
import { Checkbox } from 'antd';
import { ChevronDown, ChevronUp } from 'lucide-react';
import IconButton from '../ui/button/icon-button';
import AppSidebarItem from './app-sidebar-item';

interface Props {
    title: string;
    data: {
        name: string;
        value: string | number;
        count: number;
    }[];
    onChange?: (value: any) => void;
    value?: any;
}

function AppSidebarSection({ title, data, value, onChange }: Props) {
    const { isActive, toggleActive } = useActive(true);

    const loading = useLoading(UseLoadingType.Fetching);

    if (data.length === 0) return null;

    return (
        <div className="mb-5 border-b border-gray-300 pb-5 last:border-none">
            <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-semibold uppercase text-gray-500">
                    {title}
                </h3>
                <IconButton onClick={toggleActive}>
                    {isActive ? <ChevronUp /> : <ChevronDown />}
                </IconButton>
            </div>
            <div className={cn('', { hidden: !isActive })}>
                <Checkbox.Group
                    onChange={onChange}
                    value={value}
                    disabled={loading}
                >
                    {data.map((item) => (
                        <AppSidebarItem key={item.value} data={item} />
                    ))}
                </Checkbox.Group>
            </div>
        </div>
    );
}

export default AppSidebarSection;
