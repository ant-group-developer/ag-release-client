import { cn } from '@/helpers/common';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from 'antd';
import { useEffect, useState } from 'react';

export interface Item {
    title: string;
    href?: string;
    disabled?: boolean;
}

export interface MenuSidebarProps {
    items: Item[];
}

export default function MenuSidebar({ items }: MenuSidebarProps) {
    const [activeItem, setActiveItem] = useState<string>(items[0].title);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Tìm item phù hợp với URL hiện tại
        const currentItem = items.find(
            (item) => item.href && pathname.includes(item.href)
        );
        if (currentItem) {
            setActiveItem(currentItem.title);
        }
    }, [pathname, items]);

    const handleItemClick = (item: Item) => {
        setActiveItem(item.title);
        if (item.href) {
            router.push(item.href);
        }
    };

    return (
        <div className="flex flex-col font-bold">
            {items.map((itemMenu) => (
                <Button
                    disabled={itemMenu.disabled}
                    key={itemMenu.title}
                    type="text"
                    className={cn(
                        '!h-10 !justify-start !rounded-lg font-medium hover:!bg-card-bg-hover dark:!bg-card-bg-dark dark:hover:!bg-card-bg-hover-dark',
                        {
                            '!bg-[#e6f4ff] !text-blue-500 hover:!bg-[#e6f4ff]':
                                activeItem === itemMenu.title,
                        }
                    )}
                    onClick={() => handleItemClick(itemMenu)}
                >
                    {itemMenu.title}
                </Button>
            ))}
        </div>
    );
}
