import { DATE_FORMAT } from '@/enums/common';
import { Select, SelectProps } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
type Props = SelectProps & {};

export default function DateStatisticSelect({ ...props }: Props) {
    const messages = useTranslations();

    const generateOptions = () => {
        const currentDate = dayjs();
        const options = [];

        // 6 tháng gần nhất
        for (let i = 0; i < 6; i++) {
            const date = currentDate.subtract(i, 'month');
            options.push({
                label: date.format(DATE_FORMAT.MONTH_YEAR),
                value: `month-${i}`,
                startDate: date
                    .startOf('month')
                    .format(DATE_FORMAT.YEAR_MONTH_DAY_TIME),
                endDate: date
                    .endOf('month')
                    .format(DATE_FORMAT.YEAR_MONTH_DAY_TIME),
                key: `month-${i}`,
            });
        }

        // 3 năm gần nhất
        for (let i = 0; i < 3; i++) {
            const date = currentDate.subtract(i, 'year');
            options.push({
                label: date.format(DATE_FORMAT.YEAR),
                value: `year-${i}`,
                startDate: date
                    .startOf('year')
                    .format(DATE_FORMAT.YEAR_MONTH_DAY_TIME),
                endDate: date
                    .endOf('year')
                    .format(DATE_FORMAT.YEAR_MONTH_DAY_TIME),
                key: `year-${i}`,
            });
        }

        return options;
    };

    return (
        <Select
            className="w-[150px]"
            variant="filled"
            placeholder={messages('date.selectDate')}
            defaultValue="month-0"
            options={generateOptions()}
            {...props}
        />
    );
}
