import { TYPE_FILTER } from '@/enums/common';
import { ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

type Props = {};

export default function ReleasesSuperFilter({}: Props) {
    const ref = useRef<HTMLDivElement>(null);
    const messages = useTranslations();
    const [typeFilter, setTypeFilter] = useState<TYPE_FILTER>();

    const handleChangeTypeFilter = (value?: TYPE_FILTER) => {
        setTypeFilter(value);
    };

    useEffect(() => {
        const handleOutSideClick = (event: any) => {
            const isClickOnClearButton =
                event.target.closest('.clear-filter-btn') !== null;

            if (ref.current?.contains(event.target)) {
                if (isClickOnClearButton) {
                    return;
                }

                const chipList = document.getElementsByClassName('chip-filter');
                if (
                    !typeFilter &&
                    !Array.from(chipList).some((chip) =>
                        chip.contains(event.target)
                    )
                ) {
                    setTypeFilter(TYPE_FILTER.DROPDOWN);
                }
            } else {
                setTypeFilter(undefined);
            }
        };
        window.addEventListener('mousedown', handleOutSideClick);
        return () => {
            window.removeEventListener('mousedown', handleOutSideClick);
        };
    }, [ref, typeFilter]);

    return (
        // <div className="flex grow items-center gap-1">
        <div ref={ref} className="relative flex w-full">
            <button
                className="h-10 px-2 text-2xl"
                onClick={() => setTypeFilter(TYPE_FILTER.DROPDOWN)}
            >
                <ListFilter />
            </button>

            <div className="flex flex-1 flex-wrap gap-1">
                <div className="grow"></div>
            </div>
            {/* {canClearFilter && (
                <div>
                    <Tooltip title={messages('common.removeFilter')}>
                        <IconButton
                            className="clear-filter-btn"
                            onClick={removeFilter}
                        >
                            <X size={SIZE_ICON} />
                        </IconButton>
                    </Tooltip>
                </div>
            )} */}
        </div>
        // </div>
    );
}
