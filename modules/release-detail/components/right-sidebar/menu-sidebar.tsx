import { cn } from '@/helpers/common';
import { Button } from 'antd';
import { useState } from 'react';

export interface Item {
    title: string;
}

export interface MenuSidebarProps {
    items: Item[];
}

export default function MenuSidebar({ items }: MenuSidebarProps) {
    const [activeItem, setActiveItem] = useState<string>(items[0].title);

    return (
        <div className="flex flex-col font-bold">
            {items.map((itemMenu) => (
                <Button
                    key={itemMenu.title}
                    type="text"
                    className={cn(
                        '!h-10 !rounded-lg font-medium hover:!bg-card-bg-hover dark:!bg-card-bg-dark dark:hover:!bg-card-bg-hover-dark',
                        {
                            '!bg-[#e6f4ff] !text-blue-500 hover:!bg-[#e6f4ff]':
                                activeItem === itemMenu.title,
                        }
                    )}
                    onClick={() => setActiveItem(itemMenu.title)}
                >
                    {itemMenu.title}
                </Button>
            ))}
        </div>
    );
}
