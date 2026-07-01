'use client';

import { ReleaseCiExportRawData } from '@/modules/release-distribution/types';
import ExportTable from '@/modules/release-distribution/components/table/export-table';

type Props = {
    data?: ReleaseCiExportRawData;
    loading?: boolean;
};

export default function ExportTab({ data, loading }: Props) {
    return (
        <ExportTable
            sticky
            dataSource={data?._embedded ?? []}
            loading={loading}
            className="mt-2"
        />
    );
}
