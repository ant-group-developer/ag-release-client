import * as am5 from '@amcharts/amcharts5';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import * as am5xy from '@amcharts/amcharts5/xy';
import { useEffect, useRef } from 'react';

// Dữ liệu mẫu cho biểu đồ

type Props = {
    data: { category: string; value: number; color?: string }[];
    maxBarWidth?: number;
    maxLabelWidth?: number; // Thuậm thuộc tính để giới hạn số ký tự trên nhãn trên cột X
};

export default function BarChart({
    data,
    maxBarWidth = 40,
    maxLabelWidth = 60,
}: Props) {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef<am5.Root | null>(null);

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
                    layout: root.verticalLayout,
                    paddingRight: 20,
                })
            );

            // Tạo trục X (CategoryAxis)
            const xAxis = chart.xAxes.push(
                am5xy.CategoryAxis.new(root, {
                    categoryField: 'category',
                    renderer: am5xy.AxisRendererX.new(root, {
                        minGridDistance: 30,
                    }),
                    tooltip: am5.Tooltip.new(root, {}),
                })
            );

            xAxis.get('renderer').grid.template.set('visible', false);

            // Cuộn huỳnh labels trên cột X để tránh nhãn quá dài và thêm tooltip
            xAxis.get('renderer').labels.template.setAll({
                oversizedBehavior: 'truncate', // Trượt động cắt nguồn text quá dài
                maxWidth: maxLabelWidth, // Giới hạn độ rộng label bắng vuông thanh
                textAlign: 'center', // Căn giữa text
                tooltipText: '{category}', // Hiển thị tooltip với nội dung đầy đủ để định
            });

            // Tạo tooltip cho labels
            const labelTooltip = xAxis
                .get('renderer')
                .labels.template.get('tooltip');
            if (labelTooltip) {
                labelTooltip.set('getFillFromSprite', false);
                labelTooltip.set('autoTextColor', false);

                const background = labelTooltip.get('background');
                if (background) {
                    background.setAll({
                        fill: am5.color(0xffffff),
                        fillOpacity: 0.9,
                        stroke: am5.color(0xcccccc),
                        strokeWidth: 1,
                    });
                }

                labelTooltip.label.setAll({
                    fill: am5.color(0x000000),
                    fontSize: 12,
                });
            }

            xAxis.data.setAll(data);

            // Tạo trục Y (ValueAxis)
            const yAxis = chart.yAxes.push(
                am5xy.ValueAxis.new(root, {
                    min: 0,
                    renderer: am5xy.AxisRendererY.new(root, {}),
                })
            );

            yAxis.get('renderer').grid.template.set('visible', false);

            // Tạo chuỗi dữ liệu (Series)
            const series = chart.series.push(
                am5xy.ColumnSeries.new(root, {
                    name: 'Dữ liệu',
                    xAxis: xAxis,
                    yAxis: yAxis,
                    valueYField: 'value',
                    categoryXField: 'category',
                    tooltip: am5.Tooltip.new(root, {
                        labelText: '{valueY}',
                        getFillFromSprite: false,
                        autoTextColor: false,
                    }),
                })
            );

            // Tùy chỉnh tooltip
            const tooltip = series.get('tooltip');
            if (tooltip) {
                const background = tooltip.get('background');
                if (background) {
                    background.setAll({
                        fill: am5.color(0xffffff), // Nền trắng
                        fillOpacity: 1,
                        stroke: am5.color(0xcccccc), // Viền xám nhạt
                        strokeWidth: 1,
                    });

                    // Ép kiểu background thành PointedRectangle để thiết lập cornerRadius
                    (background as any).set('cornerRadius', 5);
                }

                tooltip.label.setAll({
                    fill: am5.color(0x000000), // Chữ đen
                });
            }

            series.columns.template.setAll({
                cornerRadiusTL: 5,
                cornerRadiusTR: 5,
                strokeOpacity: 0,
                maxWidth: maxBarWidth, // Giới hạn chiều rộng tối đa của cột
            });

            // Thêm dữ liệu vào series
            series.data.setAll(data);

            // Thêm cursor cho tương tác
            chart.set(
                'cursor',
                am5xy.XYCursor.new(root, {
                    xAxis: xAxis,
                    yAxis: yAxis,
                    behavior: 'none',
                })
            );

            // Tắt đường kẻ đứt trên cursor
            const cursor = chart.get('cursor');
            if (cursor) {
                cursor.lineX.set('visible', false);
                cursor.lineY.set('visible', false);
            }

            // Hiệu ứng animation
            series.appear(1000, 100);
        }

        // Dọn dẹp khi component unmount
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.dispose();
            }
        };
    }, [data, maxBarWidth, maxLabelWidth]);

    return (
        <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
    );
}
