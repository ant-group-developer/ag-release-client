'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import AppSearch from '@/components/ui/input/search';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '@/constants/page-size';
import { useFilter } from '@/hooks/use-filter';
import { useLoadingStatus } from '@/hooks/use-loading-status';
import { DspReportTable } from '@/modules/dsp-report/components/table';
import { dspReportQueryKeys } from '@/modules/dsp-report/constants/query-keys';
import { useGetListDspReport } from '@/modules/dsp-report/hooks/use-get-list-dsp-report';
import { DspReportDataFilter } from '@/modules/dsp-report/types';
import { PageContainer } from '@ant-design/pro-components';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';

export default function DspReport() {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const { dataFilter, onChangePage, onSearch } =
        useFilter<DspReportDataFilter>({
            page: 1,
            pageSize: PAGE_SIZE,
        });
    const { isLoading } = useLoadingStatus({
        queryKeys: [dspReportQueryKeys.lists()],
        mutationKeys: [dspReportQueryKeys.all],
    });

    const { dspReportData, refetch } = useGetListDspReport(dataFilter);

    return (
        <AppPageWrapper>
            <PageContainer
                title={messages('dspReport.label')}
                style={{
                    backgroundColor: token.colorBgLayout,
                }}
            >
                <DspReportTable
                    sticky
                    dataSource={dspReportData.items}
                    loading={isLoading}
                    pagination={{
                        pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                        current: dspReportData.metadata.page,
                        total: dspReportData.metadata.totalItems,
                    }}
                    headerTitle={
                        <AppSearch
                            className="max-w-52"
                            onChange={onSearch}
                            defaultValue={dataFilter.keyword}
                        />
                    }
                    options={{
                        reload: () => refetch(),
                    }}
                />
                <AppPagination
                    align="end"
                    className="rounded-b-lg"
                    style={{
                        backgroundColor: token?.colorBgContainer,
                    }}
                    current={dspReportData.metadata.page}
                    pageSize={dataFilter.pageSize}
                    total={dspReportData.metadata.totalItems}
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
