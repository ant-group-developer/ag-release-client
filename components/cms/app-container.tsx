import { cn } from '@/helpers/common';
import { useActive } from '@/hooks/use-active';
import { Menu } from 'lucide-react';
import { ReactNode } from 'react';
import IconButton from '../ui/button/icon-button';
import AppContent from './app-content';
import AppSidebar from './app-sidebar';
import Container from './container';

type Props = {
    children: ReactNode;
    appTitle?: ReactNode;
    sidebarContent?: ReactNode;
    hideAppTitle?: boolean;
    className?: string;
    contentClassName?: string;
};

function AppContainer({
    children,
    appTitle,
    sidebarContent,
    hideAppTitle,
    className,
    contentClassName,
}: Props) {
    const { isActive, active, deActive } = useActive();
    return (
        <Container widthFull className={cn('p2 lg:p-4', className)}>
            <div
                className={cn('mb-4 flex items-center gap-2', {
                    'mb-0': hideAppTitle,
                })}
            >
                {sidebarContent && (
                    <IconButton
                        className="w-10 text-xl lg:hidden"
                        onClick={active}
                    >
                        <Menu />
                    </IconButton>
                )}
                {!hideAppTitle && (
                    <h2 className="grow text-base font-bold">{appTitle}</h2>
                )}
            </div>
            <div className="flex gap-3">
                {sidebarContent && (
                    <AppSidebar
                        sidebarContent={sidebarContent}
                        open={isActive}
                        onClose={deActive}
                        appTitle={appTitle}
                    />
                )}
                <AppContent className={contentClassName}>{children}</AppContent>
            </div>
        </Container>
    );
}

export default AppContainer;
