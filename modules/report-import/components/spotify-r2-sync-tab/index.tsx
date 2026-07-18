'use client';

import { Col, Row } from 'antd';
import SpotifyExportSchedulerCard from './spotify-export-scheduler-card';
import SpotifyR2SyncCard from './spotify-r2-sync-card';

export default function SpotifyR2SyncTab() {
    return (
        <Row gutter={[24, 24]}>
            {/* Spotify Export Scheduler Config Card */}
            <Col span={24}>
                <SpotifyExportSchedulerCard />
            </Col>

            {/* Spotify R2 Sync Config Card */}
            <Col span={24}>
                <SpotifyR2SyncCard />
            </Col>
        </Row>
    );
}
