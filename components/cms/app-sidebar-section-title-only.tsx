import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    title: string;
}

function AppSidebarSectionTitleOnly({ title, children }: Props) {
    return (
        <div className="mb-5 border-b border-gray-300 pb-5 last:border-none">
            <div className="mb-2 flex items-center justify-between gap-2">
                <h3 className="font-semibold uppercase text-gray-500">
                    {title}
                </h3>
            </div>
            <div>{children}</div>
        </div>
    );
}

export default AppSidebarSectionTitleOnly;
