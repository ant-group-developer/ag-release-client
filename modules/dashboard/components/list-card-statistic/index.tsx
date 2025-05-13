import { ArrowUpOutlined } from '@ant-design/icons';
import { Card, Statistic } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useTranslations } from 'next-intl';

type Props = {};

export default function CardStatistic({}: Props) {
    const messages = useTranslations();
    return (
        <>
            <Title level={4}> {messages('common.statistic')} </Title>

            <div className="grid grid-cols-4 gap-2">
                <Card variant="borderless">
                    <Statistic
                        title="Đối tác: 32"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
                <Card variant="borderless">
                    <Statistic
                        title="Doanh thu: 100.000.000 VNĐ"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
                <Card variant="borderless">
                    <Statistic
                        title="Vấn đề: 10"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
                <Card variant="borderless">
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
        </>
    );
}
