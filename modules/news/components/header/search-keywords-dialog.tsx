import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import { TYPE_FILTER } from '@/enums/common';
import { Select } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { useGetListKeywords } from '../../hooks/use-get-keywords';

type Props = {
    handleChangeTypeFilter: (value?: any) => void;
    open?: boolean;
    title: React.ReactNode;
    dataFilter: any;
    onChangeFilter: (value?: any) => void;
};

const SearchKeywordsDialog = ({
    open,
    title,
    dataFilter,
    handleChangeTypeFilter,
    onChangeFilter,
}: Props) => {
    const messages = useTranslations();
    const [value, setValue] = useState<string[]>([]);
    const { keywordsData } = useGetListKeywords();

    const option =
        keywordsData?.map((item) => ({ label: item, value: item })) || [];

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            keywords: value?.join(','),
        });
        onCancel();
    };

    useEffect(() => {
        setValue(dataFilter?.keywords?.split(','));
    }, [dataFilter]);

    if (!dataFilter.keywords && !open) return null;

    return (
        <div className="relative">
            {dataFilter.keywords && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.KEYWORDS)}
                    onRemove={() => onChangeFilter({ keywords: undefined })}
                >
                    {title}: {dataFilter.keywords}
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
                // inputProps={{
                //     value,
                //     onChange: (e) => setValue(e.target.value),
                //     onKeyPress: (e) => {
                //         if (e.key === 'Enter') {
                //             onSubmit();
                //         }
                //     },
                // }}
                // showInput
            >
                {/* <div className="w-full max-w-80" /> */}
                <Select
                    defaultValue={value}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => setValue(e)}
                    allowClear
                    mode="tags"
                    className="min-w-72"
                    placeholder={messages('common.keyword')}
                    options={option}
                    popupMatchSelectWidth={false}
                    dropdownStyle={{ zIndex: 9999 }}
                    getPopupContainer={(triggerNode) =>
                        (triggerNode.closest('.ant-popover') as HTMLElement) ||
                        document.body
                    }
                />
            </AppPopover>
        </div>
    );
};

export default SearchKeywordsDialog;
