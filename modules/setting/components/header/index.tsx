import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import AppSearch from '@/components/ui/input/search';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useBackupDatabase } from '@/modules/backup-dabatase/hooks/use-backup-database';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { SettingDataFilter } from '../../types';

type Props = Pick<UseFilterProps<SettingDataFilter>, 'dataFilter' | 'onSearch'>;

export default function BackupDatabaseHeader({ dataFilter, onSearch }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { backupDatabase: backupDatabaseNow, isPending: isBackupPending } =
        useBackupDatabase();
    return (
        <AppHeader className="app-header px-0 pb-3">
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
