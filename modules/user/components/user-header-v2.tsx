import AppFilter from '@/components/ui/antd-form/app-filter';
import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { arrayFromString } from '@/helpers/array';
import { flattenData } from '@/helpers/common';
import { OnChangeFilter, RemoveFilter } from '@/hooks/use-filter';
import { TENANT_ORDER_BY } from '@/modules/tenant/enums';
import { useTenantList } from '@/modules/tenant/hooks/use-get-tenant';
import {
    ProForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { USER_TYPE } from '../enums';
import { DataFilterUser } from '../types/data';

type Props = {
    dataFilter: DataFilterUser;
    onChangeFilter: OnChangeFilter<DataFilterUser>;
    canClearFilter: boolean;
    removeFilter: RemoveFilter;
};

export default function UserHeaderV2({
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
        // status: arrayFromString(dataFilter?.status),
        keyword: dataFilter.keyword,
        id: dataFilter.id,
        type: arrayFromString(dataFilter.type),
        tenantIds: arrayFromString(dataFilter.tenantIds),
    };

    const { data: dataTenant } = useTenantList({
        fieldOrder: TENANT_ORDER_BY.NAME,
        orderBy: ORDER.ASC,
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
    const flattenDataTenant = flattenData(dataTenant.items, {});

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
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('common.keyword').toLowerCase(),
                    })}
                />

                <ProFormText
                    name="id"
                    label={messages('user.search.id')}
                    placeholder={messages('placeholder.filterBy', {
                        value: 'ID',
                    })}
                />

                <ProFormSelect
                    name="tenantIds"
                    label={messages('tenant.label')}
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('tenant.label').toLowerCase(),
                    })}
                    options={flattenDataTenant?.map((item) => ({
                        value: item?.id,
                        label: item?.name,
                    }))}
                    mode="multiple"
                    fieldProps={{
                        maxTagCount: 'responsive',
                    }}
                />

                <ProFormSelect
                    name="type"
                    label={messages('user.type')}
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('user.type').toLowerCase(),
                    })}
                    options={[
                        {
                            label: messages('user.admin'),
                            value: USER_TYPE.ADMIN,
                        },
                        {
                            label: messages('user.user'),
                            value: USER_TYPE.USER,
                        },
                    ]}
                    mode="multiple"
                    fieldProps={{
                        maxTagCount: 'responsive',
                    }}
                />

                {/* <ProFormSelect
                    name="status"
                    label={messages('status.label')}
                    placeholder={messages('placeholder.filterBy', {
                        value: messages('status.label').toLowerCase(),
                    })}
                    options={[
                        {
                            name: messages('status.active'),
                            value: BOOLEAN_RAW.TRUE.toString(),
                        },
                        {
                            name: messages('status.block'),
                            value: BOOLEAN_RAW.FALSE.toString(),
                        },
                    ]}
                    mode="multiple"
                    fieldProps={{
                        maxTagCount: 'responsive',
                    }}
                /> */}
            </AppFilter>
        </div>
    );
}
