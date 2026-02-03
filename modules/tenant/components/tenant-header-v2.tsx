import AppFilter from '@/components/ui/antd-form/app-filter';
import { arrayFromString } from '@/helpers/array';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import {
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TENANT_TYPE } from '../enums';
import { DataFilterTenant } from '../types/data';

type Props = {
    dataFilter: DataFilterTenant;
    onChangeFilter: OnChangeFilter<DataFilterTenant>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function TenantHeaderV2({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    removeFilter,
}: Props) {
    // const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();
    const [form] = ProForm.useForm();
    const messages = useTranslations();

    const initialValue = {
        ...dataFilter,
        type: arrayFromString(dataFilter.type),
    };

    const handleSubmit = (values: any) => {
        const { ...res } = values;
        onChangeFilter({
            ...res,
        });
    };

    const handleReset = (values: any) => {
        removeFilter();
        form.setFieldsValue({});
    };

    useEffect(() => {
        form.setFieldsValue(initialValue);
    }, [JSON.stringify(dataFilter)]);

    return (
        <div className="app-header mb-4">
            <AppFilter
                form={form}
                onFinish={handleSubmit}
                onReset={handleReset}
            >
                <ProFormText
                    name="keyword"
                    label={messages('common.search')}
                    placeholder={messages('placeholder.searchBy', {
                        value: messages('common.keyword').toLowerCase(),
                    })}
                />

                <ProFormSelect
                    name="type"
                    label={messages('tenant.type.title')}
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('tenant.type.title').toLowerCase(),
                    })}
                    options={[
                        {
                            label: messages('tenant.type.whiteLabel.label'),
                            value: TENANT_TYPE.WHITE_LABEL,
                        },
                        {
                            label: messages('tenant.type.label.label'),
                            value: TENANT_TYPE.LABEL,
                        },
                    ]}
                    mode="multiple"
                    fieldProps={{
                        maxTagCount: 'responsive',
                    }}
                />
            </AppFilter>
        </div>
    );
}
