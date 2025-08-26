import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    title: string;
}

function AppSidebarSectionTitleOnly({ title, children }: Props) {
    return (
        <div className="">
            <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-semibold capitalize">{title}</h3>
            </div>
            <div>{children}</div>
        </div>
    );
}

export default AppSidebarSectionTitleOnly;
