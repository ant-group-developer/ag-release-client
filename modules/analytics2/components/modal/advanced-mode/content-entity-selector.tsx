'use client';

import { Select } from 'antd';
import { useTranslations } from 'next-intl';
import { ANALYTICS_ENTITY_TYPE } from '@/modules/analytics2/enums';
import { AnalyticsEntityType } from '@/modules/analytics2/types';

export interface ContentItem {
    id: string;
    title: string;
    type: AnalyticsEntityType;
    subtitle?: string;
    thumbnailUrl?: string;
}

interface ContentEntitySelectorProps {
    selectedItem?: ContentItem;
    onSelect?: (item: ContentItem) => void;
    value?: AnalyticsEntityType;
    onChange?: (value: AnalyticsEntityType) => void;
    fromDate?: string;
    toDate?: string;
    className?: string;
}

export default function ContentEntitySelector({
    selectedItem,
    onSelect,
    value,
    onChange,
    className,
}: ContentEntitySelectorProps) {
    const messages = useTranslations();

    const currentValue: AnalyticsEntityType =
        value || selectedItem?.type || ANALYTICS_ENTITY_TYPE.RELEASE;

    const options: { value: AnalyticsEntityType; label: string }[] = [
        {
            value: ANALYTICS_ENTITY_TYPE.WORKSPACE,
            label: messages('common.workspaces') || 'Workspaces',
        },
        {
            value: ANALYTICS_ENTITY_TYPE.RELEASE,
            label: messages('common.releases') || 'Releases',
        },
        {
            value: ANALYTICS_ENTITY_TYPE.TRACK,
            label: messages('common.tracks') || 'Tracks',
        },
        {
            value: ANALYTICS_ENTITY_TYPE.LABEL,
            label: messages('common.labels') || 'Labels',
        },
        {
            value: ANALYTICS_ENTITY_TYPE.DSP,
            label: messages('common.dsps') || 'DSPs',
        },
    ];

    const handleChange = (val: AnalyticsEntityType) => {
        onChange?.(val);
        onSelect?.({
            id: '',
            title: val,
            type: val,
        });
    };

    return (
        <Select
            className={className || 'w-full'}
            value={currentValue}
            onChange={handleChange}
            options={options}
        />
    );
}

