'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { ORDER } from '@/enums/common';
import { setSortOrder } from '@/helpers/common';
import { useFilterV2 } from '@/hooks/use-filter-v2';
import { DISTRIBUTION_SORT_FIELD } from '@/modules/distribution-orchestration/constants/table';
import DistributionTable from '@/modules/distribution-orchestration/components/table';
import { DISTRIBUTION_STATE } from '@/modules/distribution-orchestration/enums';
import { RELEASE_TYPE } from '@/modules/releases/enums';
import { useGetDistributions } from '@/modules/distribution-orchestration/hooks';
import { DistributionListFilter } from '@/modules/distribution-orchestration/types';
import { PageContainer } from '@ant-design/pro-components';
import { Input, Select, Space, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { parseAsInteger, parseAsString } from 'nuqs';

export default function DistributionsPage() {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const { dataFilter, onChangePage, onChangeFilter } =
        useFilterV2<DistributionListFilter>({
            page: parseAsInteger.withDefault(1),
            pageSize: parseAsInteger.withDefault(PAGE_SIZE),
            keyword: parseAsString,
            type: parseAsString.withDefault(RELEASE_TYPE.AUDIO),
            distributionState: parseAsString,
            isImportedFromReport: parseAsString.withDefault('false'),
            orderBy: parseAsString.withDefault(ORDER.DESC),
            fieldOrder: parseAsString.withDefault(
                DISTRIBUTION_SORT_FIELD.UPDATED_AT
            ),
        });

    const { distributionsData, isFetching, refetch } =
        useGetDistributions(dataFilter);

    const onChangeSort = (_pagination: any, _filters: any, sort: any) => {
        onChangeFilter(
            {
                orderBy: setSortOrder(sort, ORDER.DESC),
                fieldOrder: sort.field,
            },
            false
        );
    };

    const stateOptions = Object.values(DISTRIBUTION_STATE).map((state) => ({
        value: state,
        label: messages(`distributionOrchestration.state.${state}`),
    }));

    return (
        <AppPageWrapper>
            <PageContainer title={messages('distributionOrchestration.label')}>
                <DistributionTable
                    headerTitle={
                        <Space wrap>
                            <Input.Search
                                allowClear
                                placeholder={messages('common.search')}
                                defaultValue={dataFilter.keyword ?? ''}
                                onSearch={(v) => onChangeFilter({ keyword: v })}
                                style={{ width: 260 }}
                            />
                            <Select
                                allowClear
                                placeholder={messages('common.status')}
                                options={stateOptions}
                                value={dataFilter.distributionState}
                                onChange={(v) =>
                                    onChangeFilter({ distributionState: v })
                                }
                                style={{ width: 200 }}
                            />
                        </Space>
                    }
                    sticky
                    dataSource={distributionsData?.items}
                    loading={isFetching}
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    onChange={onChangeSort}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: distributionsData?.metadata?.page ?? 1,
                    }}
                    options={{ reload: () => refetch(), setting: false }}
                />

                <AppPagination
                    className="rounded-b-md"
                    style={{ backgroundColor: token.colorBgContainer }}
                    align="end"
                    current={distributionsData?.metadata?.page}
                    pageSize={dataFilter.pageSize}
                    total={distributionsData?.metadata?.totalItems}
                    onChange={onChangePage}
                    showTotalText
                    showSizeChanger
                    showQuickJumper
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
                />
            </PageContainer>
        </AppPageWrapper>
    );
}
