import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import { TYPE_FILTER } from '@/enums/common';
import React, { useEffect, useState } from 'react';

type Props<T> = {
    handleChangeTypeFilter: (value?: any) => void;
    open?: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const SearchDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    handleChangeTypeFilter,
    onChangeFilter,
}: Props<T>) => {
    const [value, setValue] = useState<string>('');

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            keyword: value.trim(),
        });
        onCancel();
    };

    useEffect(() => {
        setValue(dataFilter.keyword);
    }, [dataFilter]);

    if (!dataFilter.keyword && !open) return null;

    return (
        <div className="relative">
            {dataFilter.keyword && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.KEYWORD)}
                    onRemove={() => onChangeFilter({ keyword: undefined })}
                >
                    {title}: {dataFilter.keyword}
                </Chip>
            )}

            <AppPopover
                className="top-[41px]"
                open={open}
                title={title}
                showFooter
                onCancel={onCancel}
                submitProps={{
                    className: value ? '' : 'opacity-50 cursor-not-allowed',
                    disabled: !value,
                    onClick: onSubmit,
                }}
                inputProps={{
                    value,
                    onChange: (e) => setValue(e.target.value.trim()),
                    onKeyPress: (e) => {
                        if (e.key === 'Enter') {
                            onSubmit();
                        }
                    },
                }}
                showInput
            >
                <div className="w-full max-w-80" />
            </AppPopover>
        </div>
    );
};

export default SearchDialog;
