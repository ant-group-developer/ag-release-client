import { Drawer, DrawerProps } from 'antd';
import React, { ReactNode } from 'react';
import SimpleBar from 'simplebar-react';

type Props = {
    sidebarContent: ReactNode;
    appTitle?: ReactNode;
} & Pick<DrawerProps, 'open' | 'onClose'>;

function AppSidebar({ sidebarContent, open, onClose, appTitle }: Props) {
    return (
        <React.Fragment>
            <div className="hidden flex-none rounded-2xl bg-white lg:block">
                <SimpleBar className="sidebar h-full max-h-[calc(100vh-6rem)]">
                    <div className="h-full w-72 px-5 py-3">
                        {sidebarContent}
                    </div>
                </SimpleBar>
            </div>
            <Drawer open={open} onClose={onClose} title={appTitle}>
                {sidebarContent}
            </Drawer>
        </React.Fragment>
    );
}

export default AppSidebar;
