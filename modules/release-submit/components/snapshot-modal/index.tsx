import JsonViewer from '@/components/ui/json-viewer';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useThemeMode } from '@/hooks/use-theme-mode';
import { Tabs } from 'antd';
import { ReleaseSubmitData } from '../../types';

type Props = Omit<AppModalProps, 'children'> & {
    record: ReleaseSubmitData | null;
};

export default function ReleaseSubmitSnapshotModal({
    record,
    ...props
}: Props) {
    const { isDark } = useThemeMode();

    return (
        <AppModal
            {...props}
            // title="Release Snapshot"
            footer={null}
            width={800}
            className="!top-10 !w-[60vw]"
            styles={{
                body: {
                    height: 'calc(100vh - 140px)',
                    overflowY: 'auto',
                },
            }}
        >
            {record && (
                <Tabs
                    defaultActiveKey="snapshot"
                    items={[
                        {
                            key: 'snapshot',
                            label: 'Snapshot',
                            children: (
                                <JsonViewer
                                    theme={isDark ? 'ocean' : 'rjv-default'}
                                    src={
                                        record.metadata?.input?.releaseSnapshot
                                    }
                                    style={{
                                        height: 'calc(100vh - 210px)',
                                        overflowY: 'auto',
                                    }}
                                />
                            ),
                        },
                        {
                            key: 'metadata',
                            label: 'Metadata',
                            children: (
                                <JsonViewer
                                    theme={isDark ? 'ocean' : 'rjv-default'}
                                    src={record}
                                    style={{
                                        height: 'calc(100vh - 210px)',
                                        overflowY: 'auto',
                                    }}
                                />
                            ),
                        },
                    ]}
                />
            )}
        </AppModal>
    );
}
