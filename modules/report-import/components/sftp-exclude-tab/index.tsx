import { Divider, theme } from 'antd';
import SftpExcludePatternList from './sftp-exclude-pattern-list';
import SyncConfigForm from './sync-config-form';

export default function SftpExcludeTab() {
    const { token } = theme.useToken();

    return (
        <div
            className="flex flex-col rounded-lg p-3 sm:p-4 md:p-6"
            style={{
                backgroundColor: token.colorBgContainer,
            }}
        >
            <SyncConfigForm />
            <Divider />
            <SftpExcludePatternList />
        </div>
    );
}
