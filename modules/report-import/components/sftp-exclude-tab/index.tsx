import { Divider, theme } from 'antd';
import SftpExcludePatternList from './sftp-exclude-pattern-list';
import SyncConfigForm from './sync-config-form';

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
            }}
        >
            <SyncConfigForm />
            <Divider />
            <SftpExcludePatternList />
        </div>
    );
}
