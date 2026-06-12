import { Divider, theme } from 'antd';
import SyncConfigForm from './sync-config-form';
import SftpExcludePatternList from './sftp-exclude-pattern-list';

export default function SftpExcludeTab() {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                backgroundColor: token.colorBgContainer,
                padding: 24,
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
            }}
        >
            <SyncConfigForm />
            <Divider />
            <SftpExcludePatternList />
        </div>
    );
}
