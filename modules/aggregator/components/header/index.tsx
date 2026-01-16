import AppFilter from '@/components/ui/antd-form/app-filter';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { AggregatorDataFilter } from '../../types';

type Props = {
    dataFilter: AggregatorDataFilter;
    onChangeFilter: OnChangeFilter<AggregatorDataFilter>;
    removeFilter: RemoveFilter;
};

export default function AggregatorHeader({
    onChangeFilter,
    dataFilter,
    removeFilter,
}: Props) {
    const [form] = ProForm.useForm();
    const messages = useTranslations();

    const handleSubmit = (values: any) => {
        onChangeFilter({
            ...values,
        });
    };

    const handleClear = () => {
        removeFilter();
        form.setFieldsValue({});
    };

    useEffect(() => {
        form.setFieldsValue({
            ...dataFilter,
        });
    }, [dataFilter]);

    return (
        <div className="app-header mb-4">
            <AppFilter
                form={form}
                onFinish={handleSubmit}
                onReset={handleClear}
            >
                <ProFormText
                    name="keyword"
                    label={messages('common.search')}
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('common.keyword').toLowerCase(),
                    })}
                />
            </AppFilter>
        </div>
    );
}
