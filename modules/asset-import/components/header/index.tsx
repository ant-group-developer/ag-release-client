import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import TenantSelect from '@/components/ui/select/tenant-select';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { SyncOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { useTranslations } from 'next-intl';
import { AssetImportBatchStatus, TYPE_MODAL_ASSET_IMPORT } from '../../enums';
import { AssetImportBatchFilter } from '../../types';

type Props = Pick<
    UseFilterProps<AssetImportBatchFilter>,
    'dataFilter' | 'onSearch' | 'onChangeFilter'
> & {
    handleRefresh: () => void;
    isFetching?: boolean;
};

export default function AssetImportBatchesHeader({
    dataFilter,
    onSearch,
    onChangeFilter,
    handleRefresh,
    isFetching,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const statusOptions = Object.values(AssetImportBatchStatus).map(
        (status) => ({
            label: messages(`assetImport.batch.status.${status}` as any),
            value: status,
        })
    );

    return (
        <AppHeader className="app-header p-2">
            <AppHeaderGroup>
                <div className="flex items-center gap-1">
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                    <TenantSelect
                        allowClear
                        className="!w-72"
                        placeholder={messages('assetImport.batch.targetTenant')}
                        value={dataFilter.targetTenantId}
                        onChange={(value) =>
                            onChangeFilter({ targetTenantId: value })
                        }
                    />
                    <Select
                        allowClear
                        className="!w-52"
                        placeholder={messages('common.status')}
                        options={statusOptions}
                        value={dataFilter.status}
                        onChange={(value) => onChangeFilter({ status: value })}
                    />
                </div>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <Button
                        icon={<SyncOutlined />}
                        onClick={handleRefresh}
                        loading={isFetching}
                    >
                        {messages('common.refresh')}
                    </Button>
                    <CreateButton
                        icon={<UploadOutlined />}
                        text={messages('assetImport.scan.title')}
                        onClick={() =>
                            openModal(TYPE_MODAL_ASSET_IMPORT.SCAN)
                        }
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
