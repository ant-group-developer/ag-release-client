'use client';

import AppLoader from '@/components/app-loader';
import AppContainer from '@/components/cms/app-container';
import AppPagination from '@/components/ui/pagination';
import { PAGE_SIZE } from '@/constants/page-size';
import { DATE_FORMAT } from '@/enums/common';
import { formatDatesToUTC } from '@/helpers/common';
import { useFilter } from '@/hooks/use-filter';
import LogHeader from '@/modules/log/components/log-header';
import LogTable from '@/modules/log/components/log-table';
import { useLogList } from '@/modules/log/hooks/useGetLog';
import { DataFilterLog } from '@/modules/log/types/data';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

type Props = {};

function LogPage({}: Props) {
    const messages = useTranslations();

    const [startDateCreated, endDateCreated] = formatDatesToUTC(
        dayjs()
            .subtract(30, 'day')
            .startOf('day')
            .format(DATE_FORMAT.MYSQL_TYPE_DATE),
        dayjs().endOf('day').format(DATE_FORMAT.MYSQL_TYPE_DATE)
    );
    const defaultFilter: DataFilterLog = {
        page: 1,
        pageSize: PAGE_SIZE,
        startDateCreated: startDateCreated,
        endDateCreated: endDateCreated,
    };

    const { dataFilter, onSearch, onChangePage, onChangeFilter, isReady } =
        useFilter<DataFilterLog>(defaultFilter);

    const { dataLog, totalRecord, isFetching } = useLogList(
        dataFilter,
        isReady
    );

    if (!isReady) {
        return <AppLoader className="bg-white" />;
    }

    return (
        <AppContainer appTitle={messages('log.label')}>
            <LogHeader
                dataFilter={dataFilter}
                onSearch={onSearch}
                onChangeFilter={onChangeFilter}
            />
            <LogTable
                dataSource={dataLog}
                loading={isFetching}
                pagination={{
                    pageSize: dataFilter.pageSize ?? PAGE_SIZE,
                    current: dataFilter.page ?? 1,
                }}
            />
            <AppPagination
                showTotalText
                pageSize={PAGE_SIZE}
                onChange={onChangePage}
                current={dataFilter.page}
                total={totalRecord}
            />
        </AppContainer>
    );
}

export default LogPage;
