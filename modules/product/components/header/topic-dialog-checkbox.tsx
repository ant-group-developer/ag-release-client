import { AppPopover } from '@/components/shared/app-popover';
import TopicTreeCheckbox from '@/components/ui/checkbox/tree-checkbox';
import { Chip } from '@/components/ui/chip';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { TYPE_FILTER } from '@/enums/common';
import { toNonAccentVietnamese } from '@/helpers/string';
import { useTopicListAll } from '@/modules/topic/hooks/use-get-topic';
import { TopicData } from '@/modules/topic/types';
import { Empty } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

type Props<T extends Record<string, any>> = {
    handleChangeTypeFilter: (value?: any) => void;
    open: boolean;
    title: React.ReactNode;
    dataFilter: T;
    onChangeFilter: (value?: any) => void;
};

const ProductTopicDialog = <T extends Record<string, any>>({
    open,
    title,
    dataFilter,
    onChangeFilter,
    handleChangeTypeFilter,
}: Props<T>) => {
    const messages = useTranslations();
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [keyword, setKeyword] = useState<string>();
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    const { data: topics, isLoading } = useTopicListAll();

    const findTopicById = (id: string) => {
        const searchInTopics = (
            topicList: TopicData[] | undefined
        ): TopicData | undefined => {
            if (!topicList) return undefined;

            for (const topic of topicList) {
                if (topic.id === id) return topic;

                if (topic.children) {
                    const found = searchInTopics(topic.children);
                    if (found) return found;
                }
            }
            return undefined;
        };

        return searchInTopics(topics);
    };

    const topicFiltered =
        topics?.filter((topic) => {
            if (!keyword) return true;

            const codeMatches = toNonAccentVietnamese(topic.code)
                .toLowerCase()
                .includes(toNonAccentVietnamese(keyword).toLowerCase());

            const hasMatchingChild = topic.children?.some((child) =>
                toNonAccentVietnamese(child.code)
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(keyword).toLowerCase())
            );

            return codeMatches || hasMatchingChild;
        }) || [];

    useEffect(() => {
        if (!keyword) {
            setExpandedKeys([]);
            return;
        }

        const keysToExpand: string[] = [];
        topics?.forEach((topic) => {
            if (
                topic.children?.some((child) =>
                    toNonAccentVietnamese(child.code)
                        .toLowerCase()
                        .includes(toNonAccentVietnamese(keyword).toLowerCase())
                )
            ) {
                keysToExpand.push(topic.id);
            }
        });

        if (JSON.stringify(keysToExpand) !== JSON.stringify(expandedKeys)) {
            setExpandedKeys(keysToExpand);
        }
    }, [keyword, topics]);

    const getSelectedTopicsCodes = () => {
        if (!dataFilter.topicId?.length) return '';

        const MAX_DISPLAY = 2;
        const topicIds = dataFilter.topicId.split(',');
        const translatedTopics = topicIds
            ?.map((topicId: string) => {
                const topic = findTopicById(topicId);
                return topic?.code || '';
            })
            .filter((code: string) => code !== '');

        if (translatedTopics.length <= MAX_DISPLAY) {
            return translatedTopics.join(', ');
        }

        const displayedTopics = translatedTopics.slice(0, MAX_DISPLAY);
        const remainingCount = translatedTopics.length - MAX_DISPLAY;

        return `${displayedTopics.join(', ')} ... +${remainingCount} ${messages('common.other')}`;
    };

    const onCancel = () => {
        handleChangeTypeFilter();
    };

    const onSubmit = () => {
        onChangeFilter({
            topicId: selectedTopics.length > 0 ? selectedTopics : undefined,
        });
        onCancel();
    };

    useEffect(() => {
        if (dataFilter.topicId) {
            setSelectedTopics(dataFilter.topicId.split(','));
        } else {
            setSelectedTopics([]);
        }
    }, [dataFilter.topicId]);

    if (!dataFilter.topicId?.length && !open) return null;

    return (
        <div className="relative">
            {dataFilter.topicId && dataFilter.topicId.length > 0 && (
                <Chip
                    onClick={() => handleChangeTypeFilter(TYPE_FILTER.TOPIC)}
                    onRemove={() => onChangeFilter({ topicId: undefined })}
                >
                    <CustomTooltip title={getSelectedTopicsCodes()}>
                        {title}: {getSelectedTopicsCodes()}
                    </CustomTooltip>
                </Chip>
            )}

            <AppPopover
                className="top-[41px]"
                open={open}
                title={title}
                showFooter
                submitProps={{
                    className:
                        selectedTopics.length > 0
                            ? ''
                            : 'opacity-50 cursor-not-allowed',
                    disabled: selectedTopics.length === 0,
                    onClick: onSubmit,
                }}
                onCancel={onCancel}
                inputProps={{
                    value: keyword,
                    onChange: (e) => setKeyword(e.target.value),
                }}
                showInput
                loading={isLoading}
            >
                {topics?.length > 0 ? (
                    <div className="mt-2 max-h-80 overflow-y-auto">
                        <TopicTreeCheckbox
                            checkable
                            showChildren
                            data={topicFiltered}
                            expandedKeys={expandedKeys}
                            checkedKeys={selectedTopics}
                            searchKeyword={keyword}
                            onExpand={(keys) =>
                                setExpandedKeys(keys as string[])
                            }
                            onCheck={(checkedKeys) => {
                                setSelectedTopics(checkedKeys as string[]);
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

export default ProductTopicDialog;
