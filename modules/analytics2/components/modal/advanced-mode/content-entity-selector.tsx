'use client';

import ReleaseCoverImage from '@/modules/releases/components/image/release-cover-image';
import { Input, Popover, Tabs, Typography } from 'antd';
import { ChevronDown, Search, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import EntityListArtists from './entity-list/entity-list-artists';
import EntityListChannels from './entity-list/entity-list-channels';
import EntityListDsps from './entity-list/entity-list-dsps';
import EntityListLabels from './entity-list/entity-list-labels';
import EntityListReleaseVideos from './entity-list/entity-list-release-videos';
import EntityListReleases from './entity-list/entity-list-releases';
import EntityListSourceTypes from './entity-list/entity-list-source-types';
import EntityListTracks from './entity-list/entity-list-tracks';
import EntityListWorkspaces from './entity-list/entity-list-workspaces';

export interface ContentItem {
    id: string;
    entitySubId?: string;
    title: string;
    type:
        | 'Workspace'
        | 'Release'
        | 'Track'
        | 'Label'
        | 'DSP'
        | 'Artist'
        | string;
    subtitle?: string;
    thumbnailUrl?: string;
}

export interface ContentEntitySelectorProps {
    selectedItem?: ContentItem;
    initialType?: ContentItem['type'];
    onSelect?: (item?: ContentItem) => void;
    onClear?: () => void;
    allowClear?: boolean;
    fromDate?: string;
    toDate?: string;
    className?: string;
}

function ContentItemAvatar({ item }: { item: ContentItem }) {
    const thumbnail = item.thumbnailUrl?.trim();

    // `thumbnailUrl` is overloaded: entity lists for Release/Track put an
    // internal fileId here, the others put an absolute URL. Passing both `src`
    // and `fileId` disables fileId resolution inside ReleaseCoverImage.
    // With neither set, ReleaseCoverImage renders the shared image fallback —
    // same as the ranking tables do for records without a cover art.
    const isAbsoluteUrl = !!thumbnail && /^(https?:)?\/\//.test(thumbnail);

    return (
        <ReleaseCoverImage
            width={28}
            height={28}
            src={isAbsoluteUrl ? thumbnail : undefined}
            fileId={!thumbnail || isAbsoluteUrl ? undefined : thumbnail}
            className="shrink-0 overflow-hidden rounded"
        />
    );
}

export default function ContentEntitySelector({
    selectedItem: externalSelectedItem,
    initialType = 'Release',
    onSelect,
    onClear,
    allowClear = true,
    fromDate,
    toDate,
    className,
}: ContentEntitySelectorProps) {
    const messages = useTranslations();

    const getInitialTypeLabel = (type: string) => {
        const lowerType = type.toLowerCase();
        const intlKey = `common.${lowerType}`;
        if (messages.has(intlKey as any)) {
            return messages(intlKey as any);
        }
        return type;
    };

    const getTabFromType = (type: string) => {
        const lower = type.toLowerCase();
        if (lower.startsWith('workspace')) return 'workspaces';
        if (lower.startsWith('releasevideo')) return 'releaseVideos';
        if (lower.startsWith('release')) return 'releases';
        if (lower.startsWith('track')) return 'tracks';
        if (lower.startsWith('label')) return 'labels';
        if (lower.startsWith('dsp')) return 'dsps';
        if (lower.startsWith('artist')) return 'artists';
        if (lower.startsWith('channel')) return 'channels';
        if (lower.startsWith('sourcetype')) return 'sourceTypes';
        return 'releases';
    };

    const createPlaceholderItem = (): ContentItem => ({
        id: '',
        title: getInitialTypeLabel(initialType),
        type: initialType,
    });

    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(() =>
        getTabFromType(initialType)
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<ContentItem>(
        externalSelectedItem || createPlaceholderItem()
    );

    useEffect(() => {
        if (externalSelectedItem && externalSelectedItem.id) {
            setSelectedItem(externalSelectedItem);
            if (externalSelectedItem.type) {
                setActiveTab(getTabFromType(externalSelectedItem.type));
            }
        } else {
            setSelectedItem(createPlaceholderItem());
            setActiveTab(getTabFromType(initialType));
        }
    }, [externalSelectedItem, initialType, messages]);

    const handleItemClick = (item: ContentItem) => {
        setSelectedItem(item);
        onSelect?.(item);
        setOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        const clearedItem = createPlaceholderItem();
        setSelectedItem(clearedItem);
        onClear?.();
        onSelect?.(clearedItem);
    };

    const popoverContent = (
        <div className="w-[500px] max-w-[90vw] p-3">
            {/* Input Tìm kiếm */}
            <div className="mb-3">
                <Input
                    prefix={<Search className="h-4 w-4 opacity-50" />}
                    placeholder={messages('common.searchAcrossChannel')}
                    className="rounded-full bg-slate-50 py-2 dark:bg-zinc-800"
                    variant="filled"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Tabs */}
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                size="small"
                className="custom-content-tabs mb-2"
                items={[
                    { key: 'workspaces', label: messages('common.workspaces') },
                    { key: 'releases', label: messages('common.releases') },
                    { key: 'tracks', label: messages('common.tracks') },
                    { key: 'labels', label: 'Label' },
                    { key: 'dsps', label: messages('common.dsps') },
                    { key: 'artists', label: messages('artist.label') },
                    {
                        key: 'releaseVideos',
                        label: messages('common.releasesVideo'),
                    },
                    { key: 'channels', label: messages('common.channel') },
                    {
                        key: 'sourceTypes',
                        label: messages('analytics2.distributors'),
                    },
                ]}
            />

            {/* Subtitle Top Rankings */}
            <div className="my-2 px-2">
                <Typography.Text
                    type="secondary"
                    className="text-xs font-semibold"
                >
                    {messages('common.list')}
                </Typography.Text>
            </div>

            {/* List scrollable with separate API subcomponents */}
            <div className="max-h-[320px] min-h-[180px] overflow-y-auto px-2 pr-1">
                {activeTab === 'workspaces' && (
                    <EntityListWorkspaces
                        fromDate={fromDate}
                        toDate={toDate}
                        keyword={searchQuery}
                        onSelect={handleItemClick}
                    />
                )}

                {activeTab === 'releases' && (
                    <EntityListReleases
                        fromDate={fromDate}
                        toDate={toDate}
                        keyword={searchQuery}
                        onSelect={handleItemClick}
                    />
                )}

                {activeTab === 'tracks' && (
                    <EntityListTracks
                        fromDate={fromDate}
                        toDate={toDate}
                        keyword={searchQuery}
                        onSelect={handleItemClick}
                    />
                )}

                {activeTab === 'labels' && (
                    <EntityListLabels
                        fromDate={fromDate}
                        toDate={toDate}
                        keyword={searchQuery}
                        onSelect={handleItemClick}
                    />
                )}

                {activeTab === 'dsps' && (
                    <EntityListDsps
                        fromDate={fromDate}
                        toDate={toDate}
                        keyword={searchQuery}
                        onSelect={handleItemClick}
                    />
                )}

                {activeTab === 'artists' && (
                    <EntityListArtists
                        fromDate={fromDate}
                        toDate={toDate}
                        keyword={searchQuery}
                        onSelect={handleItemClick}
                    />
                )}

                {activeTab === 'releaseVideos' && (
                    <EntityListReleaseVideos
                        fromDate={fromDate}
                        toDate={toDate}
                        keyword={searchQuery}
                        onSelect={handleItemClick}
                    />
                )}

                {activeTab === 'channels' && (
                    <EntityListChannels
                        fromDate={fromDate}
                        toDate={toDate}
                        keyword={searchQuery}
                        onSelect={handleItemClick}
                    />
                )}

                {activeTab === 'sourceTypes' && (
                    <EntityListSourceTypes
                        fromDate={fromDate}
                        toDate={toDate}
                        keyword={searchQuery}
                        onSelect={handleItemClick}
                    />
                )}
            </div>
        </div>
    );

    return (
        <Popover
            content={popoverContent}
            trigger="click"
            open={open}
            onOpenChange={setOpen}
            placement="bottomLeft"
            overlayClassName="content-entity-popover"
        >
            <div
                className={
                    className ||
                    'flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-2.5 transition-colors hover:border-slate-300 dark:border-zinc-700 dark:hover:border-zinc-600'
                }
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <ContentItemAvatar item={selectedItem} />
                    <Typography.Text
                        ellipsis={{ tooltip: selectedItem.title }}
                        className="text-sm font-medium"
                    >
                        {selectedItem.title}
                    </Typography.Text>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                    {allowClear && selectedItem?.id ? (
                        <span
                            role="button"
                            tabIndex={0}
                            onClick={handleClear}
                            className="flex h-5 w-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                        >
                            <X className="h-3.5 w-3.5" />
                        </span>
                    ) : null}
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
                </div>
            </div>
        </Popover>
    );
}
