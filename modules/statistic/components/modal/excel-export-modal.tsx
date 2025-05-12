import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import DateRangePicker from '@/components/ui/input/date-range-picker';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { formatDatesToUTC } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { GroupSelect } from '@/modules/group/components';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useExportExcelStatisticOrder } from '../../hooks/use-export-excel-statistic-order';
import { FilterOrderStatistic } from '../../types/order-statistic';

type Props = {
    dataFilter: FilterOrderStatistic;
} & Omit<AppModalProps, 'children'>;

export default function ExcelExportModal({ dataFilter, ...props }: Props) {
    const [form] = Form.useForm();

    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const { exportExcelStatisticOrder, isPending } =
        useExportExcelStatisticOrder();

    const handleExport = async (value: any) => {
        const [startDate, endDate] = formatDatesToUTC(
            value.date[0],
            value.date[1]
        );
        const params = {
            startDateDeadline: startDate,
            endDateDeadline: endDate,
            groupIds: value.group.join(','),
        };
        exportExcelStatisticOrder(params, {
            onSuccess: () => {
                closeModal();
            },
        });
    };

    useEffect(() => {
        form.setFieldsValue({
            date: [dayjs(dataFilter.startDate), dayjs(dataFilter.endDate)],
        });
    }, [dataFilter.startDate, dataFilter.endDate]);

    return (
        <AppModal
            title={messages('common.exportExcel')}
            width={550}
            open
            onCancel={closeModal}
            onOk={form.submit}
            confirmLoading={isPending}
            {...props}
        >
            <AppForm
                form={form}
                showSubmit={false}
                layout="vertical"
                onFinish={handleExport}
            >
                <AppFormItem
                    name="date"
                    label={messages('select.date')}
                    required
                >
                    <DateRangePicker className="w-full" />
                </AppFormItem>
                <AppFormItem
                    name="group"
                    label={messages('group.select')}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <GroupSelect mode="multiple" allowClear />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
