import { ArrowUpOutlined } from '@ant-design/icons';
import { Card, Statistic } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function ListStatistic({}: Props) {
    const messages = useTranslations();
    return (
        <div>
            <p className="text-lg font-bold">{messages('common.statistic')}</p>

            <div className="grid grid-cols-4 gap-4">
                <Card className="!border-gray-200">
                    <Statistic
                        title="Đối tác: 32"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
                <Card className="!border-gray-200">
                    <Statistic
                        title="Doanh thu: 100.000.000 VNĐ"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
                <Card className="!border-gray-200">
                    <Statistic
                        title="Vấn đề: 10"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
                <Card className="!border-gray-200">
                    <Statistic
                        title="Active: 21"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
            </div>
        </div>
    );
}
