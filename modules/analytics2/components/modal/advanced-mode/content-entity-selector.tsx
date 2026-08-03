'use client';

import { Avatar, Input, Popover, Tabs, Typography } from 'antd';
import { ChevronDown, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import EntityListDsps from './entity-list/entity-list-dsps';
import EntityListLabels from './entity-list/entity-list-labels';
import EntityListReleases from './entity-list/entity-list-releases';
import EntityListTracks from './entity-list/entity-list-tracks';
import EntityListWorkspaces from './entity-list/entity-list-workspaces';

export interface ContentItem {
    id: string;
    title: string;
    type: 'Workspace' | 'Release' | 'Track' | 'Label' | 'DSP' | 'Artist';
    subtitle?: string;
    thumbnailUrl?: string;
}

interface ContentEntitySelectorProps {
    selectedItem?: ContentItem;
    onSelect?: (item: ContentItem) => void;
    fromDate?: string;
    toDate?: string;
}

export default function ContentEntitySelector({
    selectedItem: externalSelectedItem,
    onSelect,
    fromDate,
    toDate,
}: ContentEntitySelectorProps) {
    const messages = useTranslations();
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('releases');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItem, setSelectedItem] = useState<ContentItem>(
        externalSelectedItem || {
            id: '',
            title: messages('common.select'),
            type: 'Release',
        }
    );

    useEffect(() => {
        if (externalSelectedItem) {
            setSelectedItem(externalSelectedItem);
        }
    }, [externalSelectedItem]);

    const handleItemClick = (item: ContentItem) => {
        setSelectedItem(item);
        onSelect?.(item);
        setOpen(false);
    };

    const popoverContent = (
        <div className="w-[500px] max-w-[90vw] p-1">
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
                    { key: 'labels', label: messages('common.labels') },
                    { key: 'dsps', label: messages('common.dsps') },
                ]}
            />

            {/* Subtitle Top Rankings */}
            <div className="my-2 px-1">
                <Typography.Text
                    type="secondary"
                    className="text-xs font-semibold"
                >
                    {messages('common.topRanking')}
                </Typography.Text>
            </div>

            {/* List scrollable with separate API subcomponents */}
            <div className="max-h-[320px] min-h-[180px] overflow-y-auto pr-1">
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
            <div className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-2.5 transition-colors hover:border-slate-300 dark:border-zinc-700 dark:hover:border-zinc-600">
                <div className="flex items-center gap-2 overflow-hidden">
                    <Avatar
                        shape="square"
                        size={28}
                        src={selectedItem.thumbnailUrl}
                        className="shrink-0 rounded"
                    >
                        {(selectedItem.title || 'S')[0]?.toUpperCase()}
                    </Avatar>
                    <Typography.Text
                        ellipsis={{ tooltip: selectedItem.title }}
                        className="text-sm font-medium"
                    >
                        {selectedItem.title}
                    </Typography.Text>
                </div>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            </div>
        </Popover>
    );
}
