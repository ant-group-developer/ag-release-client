'use client';

import { Card, Radio, Select, Table, Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import {
    ARTIST_DATA,
    LABEL_DATA,
    RELEASE_DATA,
    TRACK_DATA,
} from '../constants/mock-data';
import { useTopNData } from '../hooks/use-top-n';

export default function TracksArtistsTable() {
    const messages = useTranslations();
    const [metric, setMetric] = useState<'views' | 'revenue'>('views');
    const [topN, setTopN] = useState<number>(5);

    const sortedTracks = useTopNData(TRACK_DATA, metric, topN);
    const sortedReleases = useTopNData(RELEASE_DATA, metric, topN);
    const sortedArtists = useTopNData(ARTIST_DATA, metric, topN);
    const sortedLabels = useTopNData(LABEL_DATA, metric, topN);

    // Columns config
    const trackColumns = [
        {
            title: messages('common.track'),
            dataIndex: 'track',
            key: 'track',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={record.cover}
                        alt={text}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-900">{text}</span>
                </div>
            ),
        },
        { title: messages('common.video'), dataIndex: 'videos', key: 'videos' },
        ...(metric === 'views'
            ? [
                  {
                      title: messages('common.views'),
                      dataIndex: 'viewsStr',
                      key: 'views',
                  },
                  {
                      title: messages('common.streams'),
                      dataIndex: 'streams',
                      key: 'streams',
                  },
              ]
            : [
                  { title: messages('common.revenue'), dataIndex: 'revenueStr', key: 'revenue' },
                  {
                      title: messages('common.streams'),
                      dataIndex: 'streams',
                      key: 'streams',
                  },
              ]),
        { title: messages('common.engagement'), dataIndex: 'engagement', key: 'engagement' },
        { title: messages('common.listeners'), dataIndex: 'listeners', key: 'listeners' },
    ];

    const releaseColumns = [
        {
            title: messages('common.release'),
            dataIndex: 'release',
            key: 'release',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={record.cover}
                        alt={text}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-900">{text}</span>
                </div>
            ),
        },
        { title: messages('common.track'), dataIndex: 'tracks', key: 'tracks' },
        { title: messages('common.video'), dataIndex: 'videos', key: 'videos' },
        ...(metric === 'views'
            ? [
                  {
                      title: messages('common.views'),
                      dataIndex: 'viewsStr',
                      key: 'views',
                  },
              ]
            : [{ title: messages('common.revenue'), dataIndex: 'revenueStr', key: 'revenue' }]),
        { title: messages('common.releaseDate'), dataIndex: 'releaseDate', key: 'releaseDate' },
    ];

    const artistColumns = [
        {
            title: messages('common.artist'),
            dataIndex: 'artist',
            key: 'artist',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={record.image}
                        alt={text}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                    />
                    <span className="font-medium text-gray-900">{text}</span>
                </div>
            ),
        },
        { title: messages('common.video'), dataIndex: 'videos', key: 'videos' },
        ...(metric === 'views'
            ? [
                  {
                      title: messages('common.views'),
                      dataIndex: 'viewsStr',
                      key: 'views',
                  },
                  {
                      title: messages('common.streams'),
                      dataIndex: 'streams',
                      key: 'streams',
                  },
              ]
            : [
                  { title: messages('common.revenue'), dataIndex: 'revenueStr', key: 'revenue' },
                  {
                      title: messages('common.streams'),
                      dataIndex: 'streams',
                      key: 'streams',
                  },
              ]),
        { title: messages('common.engagement'), dataIndex: 'engagement', key: 'engagement' },
        { title: messages('common.listeners'), dataIndex: 'listeners', key: 'listeners' },
    ];

    const labelColumns = [
        {
            title: messages('common.label'),
            dataIndex: 'label',
            key: 'label',
            render: (text: string, record: any) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={record.logo}
                        alt={text}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-900">{text}</span>
                </div>
            ),
        },
        { title: messages('common.artist'), dataIndex: 'artistsCount', key: 'artistsCount' },
        { title: messages('common.release'), dataIndex: 'releasesCount', key: 'releasesCount' },
        ...(metric === 'views'
            ? [
                  {
                      title: messages('common.views'),
                      dataIndex: 'viewsStr',
                      key: 'views',
                  },
              ]
            : [{ title: messages('common.revenue'), dataIndex: 'revenueStr', key: 'revenue' }]),
        { title: messages('common.engagement'), dataIndex: 'engagement', key: 'engagement' },
    ];

    const tabItems = [
        {
            key: 'tracks',
            label: messages('common.tracks'),
            children: (
                <Table
                    columns={trackColumns}
                    dataSource={sortedTracks}
                    pagination={false}
                />
            ),
        },
        {
            key: 'releases',
            label: messages('common.release'),
            children: (
                <Table
                    columns={releaseColumns}
                    dataSource={sortedReleases}
                    pagination={false}
                />
            ),
        },
        {
            key: 'artists',
            label: messages('common.partners'),
            children: (
                <Table
                    columns={artistColumns}
                    dataSource={sortedArtists}
                    pagination={false}
                />
            ),
        },
        {
            key: 'labels',
            label: messages('common.label'),
            children: (
                <Table
                    columns={labelColumns}
                    dataSource={sortedLabels}
                    pagination={false}
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
                    <div className="flex items-center gap-3">
                        <Select
                            value={topN}
                            onChange={(value) => setTopN(value)}
                            style={{ width: 100 }}
                            options={[
                                { value: 5, label: 'Top 5' },
                                { value: 10, label: 'Top 10' },
                            ]}
                        />
                        <Radio.Group
                            value={metric}
                            onChange={(e) => setMetric(e.target.value)}
                            buttonStyle="solid"
                        >
                            <Radio.Button
                                value="views"
                                className="px-4 text-center"
                            >
                                {messages('common.views')}
                            </Radio.Button>
                            <Radio.Button
                                value="revenue"
                                className="px-4 text-center"
                            >
                                {messages('common.revenue')}
                            </Radio.Button>
                        </Radio.Group>
                    </div>
                }
            />
        </Card>
    );
}
