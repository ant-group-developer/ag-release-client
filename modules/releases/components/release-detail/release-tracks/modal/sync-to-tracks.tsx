'use client';

import AppModal from '@/components/ui/modal/normal-modal';
import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useSyncReleaseDraftToTracks } from '@/modules/releases/hooks/use-sync-release-draft-to-tracks';
import { SyncReleaseDraftToTracksPayload } from '@/modules/releases/types/payload';
import { Alert, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { Key, useState } from 'react';

const DEFAULT_SYNC_OPTIONS: SyncReleaseDraftToTracksPayload = {
    syncPrimaryGenre: true,
    syncSubGenre: true,
    syncLanguage: true,
    syncCopyright: true,
    syncArtists: true,
    syncContributors: true,
};

type Props = {
    releaseId?: string;
};

type SyncFieldRow = {
    key: keyof SyncReleaseDraftToTracksPayload;
    label: string;
    value: string | string[];
};

export default function SyncToTracksModal({ releaseId }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { syncReleaseDraftToTracks, isPending } =
        useSyncReleaseDraftToTracks();
    const [selectedSyncFields, setSelectedSyncFields] = useState<Key[]>(
        Object.keys(DEFAULT_SYNC_OPTIONS)
    );

    const emptyText = messages('release.syncToTracks.emptyValue');
    const formatValue = (values: Array<string | number | null | undefined>) =>
        values.filter(Boolean).join(', ') || emptyText;
    const formatArtists = () =>
        formValues.releaseArtists
            ?.map((item) => item?.artist?.name)
            .filter(Boolean)
            .join(', ') || emptyText;
    const formatContributors = () =>
        formValues.releaseContributors
            ?.map((item) =>
                formatValue([item?.artist?.name, item?.artistRole?.name])
            )
            .filter((item) => item !== emptyText)
            .join(', ') || emptyText;
    const formatLabeledValue = (
        label: string,
        value: string | number | null | undefined
    ) => (value ? `${label}: ${value}` : undefined);
    const formatPCopyright = () =>
        [formValues.pLineYear, formValues.pLineOwner]
            .filter(Boolean)
            .join(' ') || emptyText;
    const languageValues = [
        formatLabeledValue(
            messages('release.countryLanguage'),
            formValues.releaseLanguage?.metadataLanguageCountry?.name
        ),
        formatLabeledValue(
            messages('release.audioLanguage'),
            formValues.releaseLanguage?.audioLanguage?.name
        ),
        formatLabeledValue(
            messages('release.metadataLanguage'),
            formValues.releaseLanguage?.metadataLanguage?.name
        ),
    ].filter(Boolean) as string[];

    const syncFields: SyncFieldRow[] = [
        {
            key: 'syncPrimaryGenre',
            label: messages('release.syncToTracks.primaryGenre'),
            value: formValues.primaryGenre?.name || emptyText,
        },
        {
            key: 'syncSubGenre',
            label: messages('release.syncToTracks.subGenre'),
            value: formValues.subGenre?.name || emptyText,
        },
        {
            key: 'syncLanguage',
            label: messages('release.syncToTracks.language'),
            value: languageValues.length ? languageValues : emptyText,
        },
        {
            key: 'syncCopyright',
            label: messages('release.syncToTracks.pCopyright'),
            value: formatPCopyright(),
        },
    ];

    const columns: ColumnsType<SyncFieldRow> = [
        {
            title: messages('release.syncToTracks.dataColumn'),
            dataIndex: 'label',
            width: 180,
            render: (value: string) => (
                <Typography.Text strong>{value}</Typography.Text>
            ),
        },
        {
            title: messages('release.syncToTracks.currentValueColumn'),
            dataIndex: 'value',
            render: (value: SyncFieldRow['value']) => {
                const lines = Array.isArray(value) ? value : [value];
                const visibleLines = lines.length ? lines : [emptyText];

                return (
                    <div className="space-y-1">
                        {visibleLines.map((line) => (
                            <Typography.Text
                                key={line}
                                className="block"
                                type={
                                    line === emptyText ? 'secondary' : undefined
                                }
                            >
                                {line}
                            </Typography.Text>
                        ))}
                    </div>
                );
            },
        },
    ];

    const resetSelection = () => {
        setSelectedSyncFields(Object.keys(DEFAULT_SYNC_OPTIONS));
    };

    const handleSubmit = () => {
        const payload = Object.keys(DEFAULT_SYNC_OPTIONS).reduce(
            (acc, key) => ({
                ...acc,
                [key]: selectedSyncFields.includes(key),
            }),
            {} as SyncReleaseDraftToTracksPayload
        );
        const hasSelectedField = Object.values(payload).some(Boolean);

        if (!hasSelectedField) {
            showNotification(
                'error',
                messages('release.syncToTracks.validation.selectAtLeastOne')
            );
            return;
        }

        if (!releaseId) {
            showNotification(
                'error',
                messages('release.syncToTracks.validation.releaseNotFound')
            );
            return;
        }

        syncReleaseDraftToTracks({
            id: releaseId,
            payload,
            onSuccess: () => {
                closeModal();
                resetSelection();
            },
        });
    };

    return (
        <AppModal
            open
            title={messages('release.syncToTracks.title')}
            onCancel={() => {
                closeModal();
                resetSelection();
            }}
            onOk={handleSubmit}
            confirmLoading={isPending}
            okButtonProps={{
                disabled: isPending || selectedSyncFields.length === 0,
            }}
            width={720}
        >
            <Alert
                className="mb-4 rounded-lg"
                type="info"
                showIcon
                message={messages('release.syncToTracks.description')}
            />

            <Table
                bordered
                rowKey="key"
                size="small"
                columns={columns}
                dataSource={syncFields}
                pagination={false}
                rowSelection={{
                    selectedRowKeys: selectedSyncFields,
                    onChange: setSelectedSyncFields,
                    getCheckboxProps: () => ({
                        disabled: isPending,
                    }),
                }}
                scroll={{ y: '55vh' }}
                className="mt-4"
            />
        </AppModal>
    );
}
