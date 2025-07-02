import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import { TYPE_FILTER } from '@/enums/common';
import React, { useEffect, useState } from 'react';

type Props = {
    handleChangeTypeFilter: (value?: any) => void;
    open?: boolean;
    title: React.ReactNode;
    dataFilter: any;
    onChangeFilter: (value?: any) => void;
};

const SearchArtistIdDialog = ({
    open,
    title,
    dataFilter,
    handleChangeTypeFilter,
    onChangeFilter,
}: Props) => {
    const [value, setValue] = useState<string>('');

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            id: value.trim(),
        });
        onCancel();
    };

    useEffect(() => {
        setValue(dataFilter.id);
    }, [dataFilter]);

    if (!dataFilter.id && !open) return null;

    return (
        <div className="relative">
            {dataFilter.id && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.ID)}
                    onRemove={() => onChangeFilter({ id: undefined })}
                >
                    {title}: {dataFilter.id}
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

export default SearchArtistIdDialog;
