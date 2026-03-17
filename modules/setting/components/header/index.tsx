import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import IconButton from '@/components/ui/button/icon-button';
import AppSearch from '@/components/ui/input/search';
import { SIZE_ICON } from '@/constants/common';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useBackupDatabase } from '@/modules/backup-dabatase/hooks/use-backup-database';
import { Button } from 'antd';
import { RotateCw } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SettingDataFilter } from '../../types';

type Props = Pick<
    UseFilterProps<SettingDataFilter>,
    'dataFilter' | 'onSearch'
> & {
    handleRefresh: () => void;
};

export default function BackupDatabaseHeader({
    dataFilter,
    onSearch,
    handleRefresh,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { backupDatabase: backupDatabaseNow, isPending: isBackupPending } =
        useBackupDatabase();
    return (
        <AppHeader className="app-header p-4">
            <AppHeaderGroup>
                <div>
                    <AppSearch
                        defaultValue={dataFilter?.keyword}
                        onChange={onSearch}
                    />
                </div>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <IconButton onClick={handleRefresh}>
                        <RotateCw size={SIZE_ICON} />
                    </IconButton>
                    <Button
                        type="primary"
                        onClick={() => {
                            backupDatabaseNow({});
                        }}
                        loading={isBackupPending}
                    >
                        {messages('common.backupNow')}
                    </Button>
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
