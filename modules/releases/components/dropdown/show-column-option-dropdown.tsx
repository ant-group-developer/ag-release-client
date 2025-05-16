import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import { Button, Checkbox, Divider, Dropdown, Tooltip } from 'antd';
import { Columns3 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { RELEASES_COLUMNS_DISPLAY } from '../../enums';

type Props = {
    visibleColumns: RELEASES_COLUMNS_DISPLAY[];
    handleSetVisibleColumns: (columns: RELEASES_COLUMNS_DISPLAY[]) => void;
};

interface ColumnItem {
    key: RELEASES_COLUMNS_DISPLAY;
    label: string;
    alwaysVisible?: boolean;
}

export default function ShowColumnOptionDropdown({
    visibleColumns,
    handleSetVisibleColumns,
}: Props) {
    const messages = useTranslations();
    const toggleRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [tempVisibleColumns, setTempVisibleColumns] =
        useState<RELEASES_COLUMNS_DISPLAY[]>(visibleColumns);

    const columnsData: ColumnItem[] = [
        {
            key: RELEASES_COLUMNS_DISPLAY.I_NO,
            label: messages('common.iNo'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.THUMBNAIL,
            label: messages('common.thumbnail'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.TITLE,
            label: messages('releases.label'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.ARTIST,
            label: messages('common.artist'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.RELEASE_ID,
            label: messages('releases.id'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.TYPE,
            label: messages('releases.type'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.PUBLISHER,
            label: messages('releases.publisher'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.UPC,
            label: 'UPC',
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.TRACK_COUNT,
            label: messages('releases.trackCount'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.DURATION,
            label: messages('releases.duration'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.RELEASE_DATE,
            label: messages('releases.releaseDate'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.CREATION_DATE,
            label: messages('releases.releaseDate'),
        },
        {
            key: RELEASES_COLUMNS_DISPLAY.ACTIONS,
            label: messages('common.action'),
        },
    ];

    // Kiểm tra nếu tất cả các cột đều được tick
    const toggleableColumns = columnsData.filter((item) => !item.alwaysVisible);
    const isAllChecked = toggleableColumns.every((item) =>
        tempVisibleColumns.includes(item.key)
    );
    const isIndeterminate =
        toggleableColumns.some((item) =>
            tempVisibleColumns.includes(item.key)
        ) && !isAllChecked;

    const toggleAll = (checked: boolean) => {
        if (checked) {
            // Khi check "Tất cả", chỉ thêm các cột có thể ẩn/hiện
            const newVisibleColumns = [
                ...columnsData
                    .filter((item) => item.alwaysVisible)
                    .map((item) => item.key),
                ...toggleableColumns.map((item) => item.key),
            ];
            setTempVisibleColumns(newVisibleColumns);
        } else {
            // Khi uncheck "Tất cả", chỉ giữ lại các cột bắt buộc
            const requiredColumns = columnsData
                .filter((item) => item.alwaysVisible)
                .map((item) => item.key);
            setTempVisibleColumns(requiredColumns);
        }
    };

    const handleCancel = () => {
        // Reset state tạm về giá trị của visibleColumns hiện tại và đóng dropdown
        setTempVisibleColumns(visibleColumns);
        setOpen(false);
    };

    const handleSubmit = () => {
        // Cập nhật lại visibleColumns của parent với giá trị từ state tạm
        handleSetVisibleColumns(tempVisibleColumns);
        setOpen(false);
    };

    const toggleOpen = () => {
        setOpen((prev) => !prev);
    };

    // Cập nhật lại state tạm nếu visibleColumns của parent thay đổi
    useEffect(() => {
        setTempVisibleColumns(visibleColumns);
    }, [visibleColumns]);

    // Xử lý đóng dropdown khi click ra ngoài vùng trigger hoặc menu
    useEffect(() => {
        const handleClickOutSide = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                toggleRef.current &&
                !toggleRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener('mousedown', handleClickOutSide);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutSide);
        };
    }, [open]);

    return (
        <Dropdown
            open={open}
            trigger={['click']}
            placement="bottomRight"
            dropdownRender={() => {
                const countSelected = tempVisibleColumns.filter((col) =>
                    toggleableColumns.some((item) => item.key === col)
                ).length;
                return (
                    <div
                        ref={menuRef}
                        className="min-w-56 rounded-md border bg-white shadow-lg"
                    >
                        <div className="p-2">
                            <div className="mb-2">
                                <b>{messages('order.displayedColumn')}</b>
                            </div>
                            <div className="flex flex-col gap-2">
                                {/* Checkbox "Tất cả" */}
                                <label className="flex cursor-pointer items-center gap-2">
                                    <Checkbox
                                        indeterminate={isIndeterminate}
                                        checked={isAllChecked}
                                        onChange={(e) =>
                                            toggleAll(e.target.checked)
                                        }
                                    />
                                    {/* <span>{messages('common.all')}</span> */}
                                    <span>
                                        {`${
                                            countSelected ===
                                            toggleableColumns.length
                                                ? `${toggleableColumns.length} ${messages('common.selected')}`
                                                : `${countSelected} ${messages('common.of')} ${toggleableColumns.length} ${messages('common.selected').toLowerCase()}`
                                        }
                                    `}
                                    </span>
                                </label>
                                <Divider style={{ margin: 0 }} />
                                {/* Danh sách các cột */}
                                <div className="flex max-h-64 flex-col gap-2 overflow-y-auto">
                                    {columnsData.map((item) => {
                                        if (item.alwaysVisible) return null;
                                        return (
                                            <label
                                                key={item.key}
                                                className="flex cursor-pointer items-center gap-2"
                                            >
                                                <Checkbox
                                                    checked={tempVisibleColumns.includes(
                                                        item.key
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setTempVisibleColumns(
                                                                (prev) => [
                                                                    ...prev,
                                                                    item.key,
                                                                ]
                                                            );
                                                        } else {
                                                            setTempVisibleColumns(
                                                                (prev) =>
                                                                    prev.filter(
                                                                        (key) =>
                                                                            key !==
                                                                            item.key
                                                                    )
                                                            );
                                                        }
                                                    }}
                                                />
                                                <span>{item.label}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <Divider style={{ margin: 0 }} />
                        <div className="flex justify-end gap-2 p-2">
                            <Button type="default" onClick={handleCancel}>
                                {messages('common.cancel')}
                            </Button>
                            <Button type="primary" onClick={handleSubmit}>
                                {messages('common.submit')}
                            </Button>
                        </div>
                    </div>
                );
            }}
        >
            <div ref={toggleRef} onClick={toggleOpen}>
                <Tooltip title={messages('common.columnsDisplay')}>
                    <IconButton>
                        <Columns3 size={SIZE_ICON} />
                    </IconButton>
                </Tooltip>
            </div>
        </Dropdown>
    );
}
