import { AppPopover } from '@/components/shared/app-popover';
import { Chip } from '@/components/ui/chip';
import TopicTreeRadio from '@/components/ui/radio/tree-radio';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetProductTopicCount } from '@/modules/product/hooks/use-get-sidebar';
import { TopicCountData } from '@/modules/topic/types';
import { Empty } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { PRODUCT_MANAGEMENT_TYPE_FILTER } from '../../enum';
import { STATUS_ASSIGNEE } from '@/modules/order/enums';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: PRODUCT_MANAGEMENT_TYPE_FILTER) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const TopicDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [value, setValue] = useState<string>('');
    const [keyword, setKeyword] = useState<string>();
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    const { topicCountData, isFetching } = useGetProductTopicCount(
        { ...dataFilter, statusAssignee: STATUS_ASSIGNEE.ASSIGNED },
        open
    );
    const findTopicById = (
        topics: TopicCountData[],
        id: string
    ): TopicCountData | undefined => {
        for (const topic of topics) {
            if (topic.id === id) {
                return topic;
            }
            if (topic.children && topic.children.length > 0) {
                const found = findTopicById(topic.children, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    const topicFiltered = topicCountData.filter((topic) => {
        // Kiểm tra xem code của topic chính có khớp với từ khóa không
        const codeMatches = toNonAccentVietnamese(topic.code)
            .toLowerCase()
            .includes(toNonAccentVietnamese(keyword || '').toLowerCase());

        // Kiểm tra xem code của bất kỳ con nào có khớp với từ khóa không
        const hasMatchingChild = topic.children?.some((child) =>
            toNonAccentVietnamese(child.code)
                .toLowerCase()
                .includes(toNonAccentVietnamese(keyword || '').toLowerCase())
        );

        // Trả về true nếu code của topic chính hoặc bất kỳ con nào khớp
        return codeMatches || hasMatchingChild;
    });

    // Tìm và thiết lập các khóa cần mở rộng dựa trên từ khóa tìm kiếm
    useEffect(() => {
        if (!keyword) {
            setExpandedKeys([]);
            return;
        }

        const keysToExpand: string[] = [];

        const findMatchingChildrenKeys = (topics: TopicCountData[]) => {
            topics.forEach((topic) => {
                if (
                    topic.children?.some((child) =>
                        toNonAccentVietnamese(child.code)
                            .toLowerCase()
                            .includes(
                                toNonAccentVietnamese(
                                    keyword || ''
                                ).toLowerCase()
                            )
                    )
                ) {
                    keysToExpand.push(topic.id);
                }
            });
        };

        findMatchingChildrenKeys(topicCountData);
        // Chỉ cập nhật expandedKeys nếu có sự thay đổi
        if (JSON.stringify(keysToExpand) !== JSON.stringify(expandedKeys)) {
            setExpandedKeys(keysToExpand);
        }
    }, [keyword]); // Chỉ phụ thuộc vào keyword

    const topic = findTopicById(topicCountData, value);

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            topicId: value,
        });
        onCancel();
    };

    // Thêm điều kiện kiểm tra để tránh cập nhật không cần thiết
    useEffect(() => {
        if (value !== dataFilter.topicId) {
            setValue(dataFilter.topicId);
        }
    }, [dataFilter.topicId]);

    if (!dataFilter.topicId && !open) return null;

    return (
        <div className="relative">
            {dataFilter.topicId && (
                <Chip
                    onClick={() =>
                        handleChangeTypeFilter(
                            PRODUCT_MANAGEMENT_TYPE_FILTER.TOPIC
                        )
                    }
                    onRemove={() => onChangeFilter({ topicId: undefined })}
                >
                    {title}: {topic?.code}
                </Chip>
            )}

            <AppPopover
                className="top-[41px]"
                open={open}
                title={title}
                showFooter
                submitProps={{
                    className: value ? '' : 'opacity-50 cursor-not-allowed ',
                    disabled: !value,
                    onClick: onSubmit,
                }}
                onCancel={onCancel}
                inputProps={{
                    value: keyword,
                    onChange: (e) => setKeyword(e.target.value),
                }}
                showInput
                loading={isFetching}
            >
                {topicCountData.length > 0 ? (
                    <div className="mt-2 max-h-80 overflow-y-auto">
                        <TopicTreeRadio
                            showChildren
                            data={topicFiltered}
                            expandedKeys={expandedKeys}
                            searchKeyword={keyword}
                            onExpand={(keys) =>
                                setExpandedKeys(keys as string[])
                            }
                            onSelect={(selectedKeys) => {
                                if (selectedKeys && selectedKeys.length > 0) {
                                    setValue(selectedKeys[0] as string);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <Empty />
                )}
            </AppPopover>
        </div>
    );
};

export default TopicDialog;
