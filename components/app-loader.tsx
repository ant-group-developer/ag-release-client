import { cn } from '@/helpers/common';
import { Spin } from 'antd';
import { ReactNode } from 'react';

interface AppProps {
    loading?: boolean;
    className?: string;
    icon?: ReactNode;
}

const AppLoader = ({ loading = true, className, icon }: AppProps) => {
    if (loading)
        return (
            <div
                className={cn(
                    'disabled fixed bottom-0 left-0 right-0 top-0 z-[9999] flex items-center justify-center bg-gray-500/20 transition-opacity duration-300',
                    { '!opacity-0': !loading }, // Set opacity to 0 when not loading
                    { '!opacity-100': loading }, // Set opacity to 100 when loading
                    className
                )}
            >
                {icon ?? <Spin />}
            </div>
        );

    return null;
};

export default AppLoader;
