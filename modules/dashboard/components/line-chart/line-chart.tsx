import { cn } from '@/helpers/common';
import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { theme } from 'antd';
import { useEffect, useRef } from 'react';

// Định nghĩa kiểu dữ liệu cho props
type Props = {
    data: any[];
    series: { name: string; field: string }[];
    maxLineWidth?: number;
    className?: string;
};

export default function LineChart({
    data,
    series: seriesData,
    maxLineWidth = 2,
    className,
}: Props) {
    const chartRef = useRef(null); // Tham chiếu đến DOM của biểu đồ
    const chartInstanceRef = useRef<am5.Root | null>(null); // Tham chiếu đến instance của biểu đồ
    const { token } = theme.useToken();

    useEffect(() => {
        // Dọn dẹp biểu đồ cũ nếu có
        if (chartInstanceRef.current) {
            chartInstanceRef.current.dispose();
        }

        // Chỉ tạo biểu đồ khi DOM đã sẵn sàng
        if (chartRef.current) {
            // Khởi tạo root element cho biểu đồ
            const root = am5.Root.new(chartRef.current);
            chartInstanceRef.current = root;

            // Áp dụng chủ đề hoạt ảnh
            root.setThemes([am5themes_Animated.new(root)]);

            // Tạo biểu đồ XY
            const chart = root.container.children.push(
                am5xy.XYChart.new(root, {
                    panX: false,
                    panY: false,
                    wheelX: 'none',
                    wheelY: 'none',
                    layout: root.verticalLayout,
                    paddingLeft: 0,
                    paddingRight: 0,
                })
            );

            chart.set(
                'background',
                am5.Rectangle.new(root, {
                    fill: am5.color(token.colorBgContainer),
                })
            );

            // Tạo trục X (CategoryAxis)
            const xAxis = chart.xAxes.push(
                am5xy.DateAxis.new(root, {
                    baseInterval: { timeUnit: 'month', count: 1 },
                    renderer: am5xy.AxisRendererX.new(root, {
                        minGridDistance: 40,
                    }),
                    extraMin: -0.05, // thu nhỏ về trái
                    extraMax: -0.05, // thu nhỏ về phải
                })
            );
            xAxis.get('renderer').labels.template.setAll({
                fill: am5.color(0x333333),
            });
            xAxis.get('renderer').grid.template.setAll({
                stroke: am5.color(0xcccccc),
                strokeOpacity: 0.5,
                visible: false,
            });

            // Tạo trục Y (ValueAxis)
            const yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    min: 0,
                    renderer: am5xy.AxisRendererY.new(root, {}),
                })
            );
            yAxis.get('renderer').labels.template.setAll({
                fill: am5.color(0x333333),
            });
            yAxis.get('renderer').grid.template.setAll({
                stroke: am5.color(0xcccccc),
                strokeOpacity: 0.5,
            });

            const createSeries = (field: string, name: string) => {
                const series = chart.series.push(
                    am5xy.SmoothedXLineSeries.new(root, {
                        name: name,
                        xAxis: xAxis,
                        yAxis: yAxis,
                        valueYField: field,
                        valueXField: 'date',
                        tooltip: am5.Tooltip.new(root, {
                            labelText: '{name}: {valueY}',
                            getFillFromSprite: false,
                            autoTextColor: false,
                            pointerOrientation: 'vertical',
                        }),
                    })
                );

                const tooltip = series.get('tooltip');
                if (tooltip) {
                    const background = tooltip.get('background');
                    if (background) {
                        background.setAll({
                            fill: am5.color(0x000000),
                            fillOpacity: 0.8,
                        });
                    }
                    tooltip.label.setAll({
                        fill: am5.color(0xffffff),
                    });
                }

                series.strokes.template.setAll({
                    strokeWidth: maxLineWidth,
                });

                series.fills.template.setAll({
                    fillOpacity: 0.5,
                    visible: true,
                    fillGradient: am5.LinearGradient.new(root, {
                        stops: [
                            {
                                color: series.get('fill'),
                                opacity: 0.2,
                            },
                            {
                                color: series.get('fill'),
                                opacity: 0,
                            },
                        ],
                        rotation: 90,
                    }),
                });

                series.data.setAll(data);
                series.appear(1000);
            };

            seriesData.forEach((s) => {
                createSeries(s.field, s.name);
            });

            const legend = chart.children.push(
                am5.Legend.new(root, {
                    paddingTop: 20,
                    x: am5.p50,
                    centerX: am5.p50,
                })
            );
            legend.labels.template.setAll({
                fill: am5.color(0x333333),
            });
            legend.data.setAll(chart.series.values);

            const cursor = chart.set(
                'cursor',
                am5xy.XYCursor.new(root, {
                    behavior: 'zoomX',
                })
            );
            cursor.lineY.set('visible', true);
            cursor.lineY.set('stroke', am5.color(0xcccccc));
            cursor.lineY.set('strokeDasharray', [2, 2]);
            cursor.lineX.set('visible', false);

            // Hiệu ứng animation
            chart.appear(1000, 100);
        }

        // Dọn dẹp khi component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose();
            }
        };
    }, [data, seriesData, maxLineWidth, token]);

    return (
        <div
            ref={chartRef}
            className={cn('w-full, h-[300px]', className)}
        ></div>
    );
}
