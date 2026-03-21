'use client';

import { Card, Input, Table, Tabs } from 'antd';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ARTIST_DATA, TRACK_DATA } from '../constants/mock-data';

export default function TracksArtistsTable() {
    const messages = useTranslations();

    const trackColumns = [
        {
            title: messages('common.track'),
            dataIndex: 'track',
            key: 'track',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <img
                        src={record.cover}
                        alt={text}
                        className="h-10 w-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-900">{text}</span>
                </div>
            ),
        },
        { title: 'Videos', dataIndex: 'videos', key: 'videos' },
        { title: messages('common.views'), dataIndex: 'views', key: 'views' },
        { title: 'Engagement', dataIndex: 'engagement', key: 'engagement' },
        {
            title: messages('common.streams'),
            dataIndex: 'streams',
            key: 'streams',
        },
        { title: 'Listeners', dataIndex: 'listeners', key: 'listeners' },
    ];

    const artistColumns = [
        {
            title: messages('common.artist'),
            dataIndex: 'artist',
            key: 'artist',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <img
                        src={record.image}
                        alt={text}
                        className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">{text}</span>
                </div>
            ),
        },
        { title: 'Videos', dataIndex: 'videos', key: 'videos' },
        { title: messages('common.views'), dataIndex: 'views', key: 'views' },
        { title: 'Engagement', dataIndex: 'engagement', key: 'engagement' },
        {
            title: messages('common.streams'),
            dataIndex: 'streams',
            key: 'streams',
        },
        { title: 'Listeners', dataIndex: 'listeners', key: 'listeners' },
    ];

    const tabItems = [
        {
            key: 'tracks',
            label: messages('common.tracks'),
            children: (
                <Table
                    columns={trackColumns}
                    dataSource={TRACK_DATA}
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        className: 'px-4',
                    }}
                    className="mt-4"
                />
            ),
        },
        {
            key: 'artists',
            label: messages('common.partners'),
            children: (
                <Table
                    columns={artistColumns}
                    dataSource={ARTIST_DATA}
                    pagination={{
                        pageSize: 5,
                        showSizeChanger: false,
                        className: 'px-4',
                    }}
                    className="mt-4"
                />
            ),
        },
    ];

    return (
        <Card
            className="mt-8 rounded-xl border-none shadow-sm"
            styles={{ body: { padding: '24px' } }}
        >
            <Tabs
                defaultActiveKey="tracks"
                items={tabItems}
                className="analytics-tabs"
                tabBarExtraContent={
                    <Input
                        placeholder="Search"
                        prefix={<Search className="h-4 w-4 text-gray-400" />}
                        className="h-9 w-64 border-none bg-gray-50"
                        style={{ borderRadius: '8px' }}
                    />
                }
            />
        </Card>
    );
}
