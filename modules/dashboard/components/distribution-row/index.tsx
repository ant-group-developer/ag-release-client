'use client';

import { Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import {
    ARTIST_DATA_REVENUE,
    ARTIST_DATA_STREAM,
    CHART_COLORS,
    DSP_DATA_REVENUE,
    DSP_DATA_STREAM,
    LABEL_DATA_REVENUE,
    LABEL_DATA_STREAM,
} from '../../constants/dashboard-data';
import DistributionPieChart from '../pie-chart';

export default function DistributionRow() {
    const messages = useTranslations();

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
                <DistributionPieChart
                    title="DSP"
                    subtitle={`Biểu đồ phân phối theo DSP`}
                    streamData={DSP_DATA_STREAM}
                    revenueData={DSP_DATA_REVENUE}
                    colors={CHART_COLORS}
                />
            </Col>
            <Col xs={24} md={8}>
                <DistributionPieChart
                    title="Label"
                    subtitle={`Biểu đồ thống kê theo Label`}
                    streamData={LABEL_DATA_STREAM}
                    revenueData={LABEL_DATA_REVENUE}
                    colors={CHART_COLORS}
                />
            </Col>
            <Col xs={24} md={8}>
                <DistributionPieChart
                    title="Artist"
                    subtitle={`Biểu đồ thống kê theo nghệ sĩ`}
                    streamData={ARTIST_DATA_STREAM}
                    revenueData={ARTIST_DATA_REVENUE}
                    colors={CHART_COLORS}
                />
            </Col>
        </Row>
    );
}
