import { toNonAccentVietnamese } from '@/helpers/string';
import { cn } from '@/helpers/tailwind';
import usePermissionStore from '@/hooks/use-permission';
import { useCreateTopic } from '@/modules/topic/hooks/use-create-topic';
import { TopicData } from '@/modules/topic/types';
import { TreeSelect, TreeSelectProps } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type Props = {
    data: TopicData[];
    enableParentSelection?: boolean;
} & TreeSelectProps;

function TopicSelect({
    data,
    enableParentSelection = false,
    className,
    ...props
}: Props) {
    const [form] = useForm();
    const messages = useTranslations();
    const { canCreate } = usePermissionStore((state) => state.permission.topic);

    const generateTreeData = (topics: TopicData[], isRoot = true): any[] => {
        return topics.map((topic) => ({
            title: topic.code,
            value: topic.id,
            key: topic.id,
            disabled: !enableParentSelection && isRoot,
            children: topic.children
                ? generateTreeData(topic.children, false)
                : undefined,
        }));
    };

    const generateSelectData = useMemo(() => {
        return data.map((topic) => ({
            value: topic.id,
            label: topic.code,
            disabled: !topic.isActive,
        }));
    }, [data]);

    const treeData = useMemo(() => generateTreeData(data), [data]);

    const { createTopic, isPending } = useCreateTopic();
    const handleCreateTopic = (values: any) => {
        createTopic({
            payload: { ...values },
            onSuccess: () => form.resetFields(),
        });
    };

    return (
        <TreeSelect
            allowClear
            showSearch
            filterTreeNode={(inputValue, treeNode) => {
                const title = treeNode.title as string;
                return toNonAccentVietnamese(title)
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(inputValue).toLowerCase());
            }}
            className={cn('w-full', className)}
            // treeDefaultExpandAll
            {...props}
            treeData={treeData}
            // dropdownRender={(menu) => (
            //     <>
            //         {menu}
            //         {canCreate && (
            //             <Fragment>
            //                 <Divider style={{ margin: '8px 0' }} />
            //                 <div className="gap-2 px-2 py-2">
            //                     <AppForm
            //                         form={form}
            //                         submitText={messages('common.create')}
            //                         onFinish={handleCreateTopic}
            //                         submitProps={{ loading: isPending }}
            //                     >
            //                         <AppFormItem
            //                             name="parentId"
            //                             label={messages('topic.label')}
            //                             required
            //                             rules={[
            //                                 {
            //                                     required: true,
            //                                     message:
            //                                         messages(
            //                                             'validation.select'
            //                                         ),
            //                                 },
            //                             ]}
            //                         >
            //                             <Select
            //                                 allowClear
            //                                 showSearch
            //                                 placeholder={messages(
            //                                     'action.create'
            //                                 )}
            //                                 options={generateSelectData}
            //                                 onMouseDown={(e) =>
            //                                     e.stopPropagation()
            //                                 }
            //                             />
            //                         </AppFormItem>
            //                         <AppFormItem
            //                             name="code"
            //                             required
            //                             label={messages('topic.code')}
            //                             rules={[
            //                                 {
            //                                     required: true,
            //                                     message:
            //                                         messages(
            //                                             'validation.input'
            //                                         ),
            //                                 },
            //                             ]}
            //                         >
            //                             <Input
            //                                 allowClear
            //                                 placeholder="Code"
            //                                 onKeyDown={(e) =>
            //                                     e.stopPropagation()
            //                                 }
            //                             />
            //                         </AppFormItem>
            //                     </AppForm>
            //                 </div>
            //             </Fragment>
            //         )}
            //     </>
            // )}
        />
    );
}

export default TopicSelect;
