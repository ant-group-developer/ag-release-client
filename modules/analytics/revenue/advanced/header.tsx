import IconButton from '@/components/ui/button/icon-button';
import AppSearch from '@/components/ui/input/search';
import { SIZE_ICON } from '@/constants/common';
import { Link } from '@/i18n/routing';
import { Checkbox } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { X } from 'lucide-react';

type Props = {};

export default function Header({}: Props) {
 
    return (
        <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between border bg-white px-6 py-2">
            <span className="text-lg font-semibold">Advanced analytics</span>
            <Link href="/analytics/revenue/dashboard">
                <IconButton>
                    <X size={SIZE_ICON} />
                </IconButton>
            </Link>
        </div>
    );
}
