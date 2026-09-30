'use client';

import { Descriptions, Modal, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useGetReleaseMergeItem } from '../hooks/use-get-item';
import ReasonTags, { CodeList } from './reason-tags';
import { ClassificationTag, ItemStatusTag } from './status-tag';

type Props = {
    scanId?: string | null;
    itemId?: string | null;
    open: boolean;
    onClose: () => void;
};

export default function ReleaseMergeItemModal({
    scanId,
    itemId,
    open,
    onClose,
}: Props) {
    const messages = useTranslations();
    const { item, isFetching } = useGetReleaseMergeItem(
        scanId,
        itemId,
        open
    );

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={760}
            title={messages('releaseMerge.itemDetail')}
            destroyOnHidden
        >
            <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label={messages('common.status')}>
                    {isFetching && !item ? (
                        messages('releaseMerge.loading')
                    ) : (
                        <ItemStatusTag status={item?.status} />
                    )}
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('releaseMerge.classification.label')}
                >
                    <ClassificationTag classification={item?.classification} />
                </Descriptions.Item>
                <Descriptions.Item label={messages('releaseMerge.sourceRelease')}>
                    <Typography.Text copyable={!!item?.sourceReleaseId}>
                        {item?.sourceReleaseId || '-'}
                    </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item label={messages('releaseMerge.targetRelease')}>
                    <Typography.Text copyable={!!item?.targetReleaseId}>
                        {item?.targetReleaseId || '-'}
                    </Typography.Text>
                </Descriptions.Item>
                <Descriptions.Item
                    label={messages('releaseMerge.candidateTargets')}
                >
                    <CodeList codes={item?.candidateTargetReleaseIds} />
                </Descriptions.Item>
                <Descriptions.Item label={messages('releaseMerge.sharedIsrc')}>
                    <CodeList codes={item?.sharedIsrcs} />
                </Descriptions.Item>
                <Descriptions.Item label={messages('releaseMerge.sourceOnlyIsrc')}>
                    <CodeList codes={item?.sourceOnlyIsrcs} />
                    {!!item?.sourceOnlyIsrcs?.length && (
                        <Typography.Paragraph
                            type="secondary"
                            className="!mb-0 !mt-1 !text-xs"
                        >
                            {messages('releaseMerge.sourceOnlyHint')}
                        </Typography.Paragraph>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label={messages('releaseMerge.targetOnlyIsrc')}>
                    <CodeList codes={item?.targetOnlyIsrcs} />
                </Descriptions.Item>
                <Descriptions.Item label={messages('releaseMerge.trackCounts')}>
                    {item
                        ? messages('assetImport.merge.tracks', {
                              source: item.sourceTrackCount,
                              target: item.targetTrackCount,
                          })
                        : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={messages('releaseMerge.upc')}>
                    {item
                        ? item.upcEquivalent
                            ? messages('assetImport.merge.upcEquivalent')
                            : messages('assetImport.merge.upcDifferent')
                        : '-'}
                </Descriptions.Item>
                <Descriptions.Item label={messages('assetImport.merge.reason')}>
                    <ReasonTags codes={item?.reasonCodes} />
                </Descriptions.Item>
                <Descriptions.Item label={messages('common.error')}>
                    {item?.errorMessage || '-'}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}
