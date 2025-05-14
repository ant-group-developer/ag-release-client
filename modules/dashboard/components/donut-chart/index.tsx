'use client';

import { useEffect, useRef } from 'react';

// Import amCharts
import * as am5 from '@amcharts/amcharts5';
import * as am5percent from '@amcharts/amcharts5/percent';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { ChartData } from '../../constants/donutChartData';

interface DonutChartProps {
    data: ChartData[];
    title?: string;
    className?: string;
    innerRadius?: number; // Giá trị từ 0 đến 100 (phần trăm)
    showCenterLabel?: boolean;
    centerLabelText?: string;
    showLabels?: boolean; // Thêm prop để kiểm soát việc hiển thị labels
}

const DonutChart = ({
    data,
    title,
    className = '',
    innerRadius = 60,
    showCenterLabel = true,
    centerLabelText = 'Tổng cộng',
    showLabels = false, // Mặc định không hiển thị labels
}: DonutChartProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstanceRef = useRef<am5.Root | null>(null);

    useEffect(() => {
        // Khởi tạo chart chỉ nếu không tồn tại
        if (!chartInstanceRef.current && chartRef.current) {
            // Tạo root element
            const root = am5.Root.new(chartRef.current);
            chartInstanceRef.current = root;

            // Thiết lập theme
            root.setThemes([am5themes_Animated.new(root)]);

            // Tạo chart
            const chart = root.container.children.push(
                am5percent.PieChart.new(root, {
                    layout: root.verticalLayout,
                    innerRadius: am5.percent(innerRadius),
                })
            );

            // Tạo một tooltip toàn cục với cấu hình cố định
            const tooltip = am5.Tooltip.new(root, {
                pointerOrientation: 'horizontal',
                labelText: '{category}: {value}',
                getFillFromSprite: false,
                autoTextColor: false,
            });

            // Cấu hình ngoại hình cố định cho tooltip
            tooltip.get('background')?.setAll({
                fill: am5.color(0xffffff),
                fillOpacity: 1,
                stroke: am5.color(0xcccccc),
                strokeWidth: 1,
            });

            tooltip.label.setAll({
                fill: am5.color(0x000000),
                fontSize: 12,
                fontWeight: 'normal',
            });

            // Tạo series
            const series = chart.series.push(
                am5percent.PieSeries.new(root, {
                    valueField: 'value',
                    categoryField: 'category',
                    alignLabels: false,
                })
            );

            // Gán tooltip cố định
            series.set('tooltip', tooltip);

            // Tắt hiển thị labels nếu showLabels = false
            if (!showLabels) {
                series.labels.template.set('forceHidden', true);
                series.ticks.template.set('forceHidden', true);
            } else {
                // Đặt vị trí labels nếu hiển thị
                series.labels.template.setAll({
                    textType: 'circular',
                    centerX: 0,
                    centerY: 0,
                });

                // Hiển thị phần trăm
                series.ticks.template.set('visible', true);
            }

            series.slices.template.set('toggleKey', 'none');

            // Thêm dữ liệu với màu tùy chỉnh
            const chartData = data.map((item) => ({
                category: item.category,
                value: item.value,
                fill: item.color ? am5.color(item.color) : undefined,
            }));
            series.data.setAll(chartData);

            // Thêm label ở giữa
            if (showCenterLabel) {
                // Title label ở giữa
                chart.children.push(
                    am5.Label.new(root, {
                        text: centerLabelText,
                        fontSize: 16,
                        textAlign: 'center',
                        x: am5.percent(50),
                        centerX: am5.percent(50),
                        y: am5.percent(45),
                        centerY: am5.percent(45),
                    })
                );

                // Số liệu ở giữa
                chart.children.push(
                    am5.Label.new(root, {
                        fontSize: 30,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        x: am5.percent(50),
                        centerX: am5.percent(50),
                        y: am5.percent(55),
                        centerY: am5.percent(55),
                    })
                );
            }

            const legend = chart.children.push(
                am5.Legend.new(root, {
                    centerX: am5.percent(50),
                    x: am5.percent(50),
                    marginTop: 15,
                    marginBottom: 15,
                })
            );
            legend.labels.template.setAll({
                textAlign: 'left', // Canh lề chữ
                fontSize: 12, // Chỉnh kích thước chữ
            });
            legend.data.setAll(series.dataItems);

            // Hiệu ứng animation
            series.appear(1000, 100);
        }

        // Cleanup khi component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose();
                chartInstanceRef.current = null;
            }
        };
    }, [
        data,
        title,
        innerRadius,
        showCenterLabel,
        centerLabelText,
        showLabels,
    ]);

    return (
        <div className={` ${className}`}>
            <div className="flex items-center justify-between">
                {/* <p className="px-4 text-lg font-bold">{title}</p> */}
                {/* <div>
                    <SeeMoreButton />
                </div> */}
            </div>
            <div
                ref={chartRef}
                style={{ width: '100%', height: '400px' }}
            ></div>
        </div>
    );
};

export default DonutChart;
