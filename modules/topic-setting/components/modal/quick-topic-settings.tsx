import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import TopicSelect from '@/modules/order/components/form/select-topic';
import { useGetProductTypes } from '@/modules/product-types/hooks/use-get-product-types';
import { TopicData } from '@/modules/topic/types';
import UserSelect from '@/modules/user/components/user-select';
import { Button, Checkbox, Form, InputNumber } from 'antd';
import { useTranslations } from 'next-intl';
import { TOPIC_SETTING_TABS, TYPE_MODAL_TOPIC_SETTING } from '../../enums';
import { useUpdateTopicAssignee } from '../../hooks/use-update-topic-assignee';
import { TopicAssignee, TopicAssigneePayload } from '../../types';

type Props = {
    dataTopic: TopicData[];
    topicAssignee: TopicAssignee[];
    currentTab: TOPIC_SETTING_TABS;
};

export default function QuickTopicSettingsModal({
    dataTopic,
    topicAssignee,
    currentTab,
}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const typeModal = useModalStore((state) => state.typeModal);
    const openModal = useModalStore((state) => state.openModal);
    const closeModal = useModalStore((state) => state.closeModal);
    const { productTypesData } = useGetProductTypes();
    const { updateTopicAssignee, isPending } = useUpdateTopicAssignee();
    const { active, isActive, deActive } = useActive();

    const handleTopicChange = (topicId: string) => {
        // Tìm ra assignTopic
        const assignTopic = topicAssignee.filter(
            (assignee) => assignee.topicId === topicId
        );

        // Tạo ra formValues
        const formValues = assignTopic.reduce(
            (acc, item) => {
                const code = item.productType?.code;
                if (code) {
                    acc[`${code}AssigneeId`] = item.assigneeId;
                    acc[`${code}ReviewerId`] = item.approverId;
                    acc[`${code}Rate`] = item.rate;
                }
                return acc;
            },
            {} as Record<string, any>
        );

        form.setFieldsValue(formValues);
    };

    const onFinish = (formValues: any) => {
        // 1. Đọc flag "ghi đè"
        const shouldOverwriteAll: boolean = formValues.override === true;

        // 2. Xác định danh sách topic IDs được chọn (có thể là nhiều nếu multiple)
        const selectedTopicIds: string[] = Array.isArray(formValues.topicId)
            ? formValues.topicId
            : [formValues.topicId];
        console.log('Selected topic IDs:', selectedTopicIds);

        // 3. Lấy ra tất cả các topic con (nếu chọn cha) hoặc chính nó
        const topicIdentifiersToProcess: string[] = selectedTopicIds.flatMap(
            (topicId) => {
                const foundTopic = dataTopic.find((t) => t.id === topicId);
                if (foundTopic?.children?.length) {
                    return foundTopic.children.map((child) => child.id);
                }
                return [topicId];
            }
        );

        // 4. Chuẩn bị mảng payload
        const payloadList: TopicAssigneePayload[] = [];

        // 5. Duyệt qua từng topic và từng loại product
        topicIdentifiersToProcess.forEach((topicIdentifier) => {
            productTypesData?.items?.forEach((productTypeItem) => {
                const productTypeCode = productTypeItem.code;

                // Xác định trường và giá trị tương ứng với tab hiện tại
                let fieldName: string;
                if (currentTab === TOPIC_SETTING_TABS.ASSIGNEE) {
                    fieldName = `${productTypeCode}AssigneeId`;
                } else if (currentTab === TOPIC_SETTING_TABS.APPROVER) {
                    fieldName = `${productTypeCode}ReviewerId`;
                } else {
                    fieldName = `${productTypeCode}Rate`;
                }

                const fieldValue = formValues[fieldName];

                // Tìm bản ghi hiện có
                const existingRecord = topicAssignee.find(
                    (record) =>
                        record.topicId === topicIdentifier &&
                        record.productTypeId === productTypeItem.id
                );

                // Lấy giá trị hiện tại tương ứng với tab
                let existingValue;
                if (currentTab === TOPIC_SETTING_TABS.ASSIGNEE) {
                    existingValue = existingRecord?.assigneeId;
                } else if (currentTab === TOPIC_SETTING_TABS.APPROVER) {
                    existingValue = existingRecord?.approverId;
                } else {
                    existingValue = existingRecord?.rate;
                }

                // Logic mới: Xử lý tất cả các trường hợp
                const payloadItem: TopicAssigneePayload = {
                    topicId: topicIdentifier,
                    productTypeId: productTypeItem.id,
                };

                // Luôn gán giá trị cho trường tương ứng, bất kể có override hay không
                if (currentTab === TOPIC_SETTING_TABS.ASSIGNEE) {
                    payloadItem.assigneeId = fieldValue;
                } else if (currentTab === TOPIC_SETTING_TABS.APPROVER) {
                    payloadItem.approverId = fieldValue;
                } else {
                    payloadItem.rate = fieldValue;
                }

                // Kiểm tra giá trị hiện tại có trống không
                const isExistingValueEmpty =
                    existingValue === undefined ||
                    existingValue === null ||
                    (currentTab === TOPIC_SETTING_TABS.RATE &&
                        existingValue === 0);

                // Thêm vào payload nếu:
                // 1. Override = true (luôn thêm)
                // 2. Override = false và topic chưa có giá trị (hoặc rate = 0)
                if (shouldOverwriteAll || isExistingValueEmpty) {
                    payloadList.push(payloadItem);
                } else {
                }
            });
        });

        active();
        updateTopicAssignee({
            payload: payloadList,
            onSuccess: () => {
                deActive();
                form.resetFields();
                closeModal();
            },
            onError: () => {
                deActive();
            },
        });
    };

    const handleClose = () => {
        form.resetFields();
        closeModal();
    };

    return (
        <div>
            <Button
                onClick={() =>
                    openModal(TYPE_MODAL_TOPIC_SETTING.QUICK_SETTING)
                }
            >
                {messages('setting.quickSetting')}
            </Button>

            <AppModal
                open={typeModal === TYPE_MODAL_TOPIC_SETTING.QUICK_SETTING}
                onCancel={handleClose}
                title={messages('setting.quickSetting')}
                onOk={() => form.submit()}
                confirmLoading={isPending}
                width={900}
            >
                <AppForm
                    onFinish={onFinish}
                    form={form}
                    layout="vertical"
                    showSubmit={false}
                >
                    <AppFormItem
                        name="topicId"
                        label="Topic (Nếu bỏ trống sẽ áp dung cho tất cả)"
                    >
                        <TopicSelect
                            treeCheckable={true}
                            multiple
                            data={dataTopic}
                            placeholder={messages('topic.label')}
                            onChange={(value) => handleTopicChange(value)}
                            enableParentSelection={true}
                        />
                    </AppFormItem>

                    {currentTab === TOPIC_SETTING_TABS.APPROVER && (
                        <AppFormItem
                            label={messages('common.approver')}
                            className="!mb-0"
                        >
                            <div className="flex gap-1">
                                {productTypesData?.items?.map((item) => (
                                    <AppFormItem
                                        key={item.id}
                                        name={`${item.code}ReviewerId`}
                                        className="w-[33.33%]"
                                    >
                                        <UserSelect
                                            placeholder={item.nameVi}
                                            allowClear
                                        />
                                    </AppFormItem>
                                ))}
                            </div>
                        </AppFormItem>
                    )}

                    {currentTab === TOPIC_SETTING_TABS.ASSIGNEE && (
                        <AppFormItem
                            label={messages('common.assignee')}
                            className="!mb-0"
                        >
                            <div className="flex gap-1">
                                {productTypesData?.items?.map((item) => (
                                    <AppFormItem
                                        key={item.id}
                                        name={`${item.code}AssigneeId`}
                                        className="w-[33.33%]"
                                    >
                                        <UserSelect
                                            placeholder={item.nameVi}
                                            allowClear
                                        />
                                    </AppFormItem>
                                ))}
                            </div>
                        </AppFormItem>
                    )}

                    {currentTab === TOPIC_SETTING_TABS.RATE && (
                        <AppFormItem label={messages('rating.point')} required>
                            <div className="flex gap-1">
                                {productTypesData?.items?.map((item) => (
                                    <AppFormItem
                                        key={item.id}
                                        name={`${item.code}Rate`}
                                        className="!mb-0 w-[33.33%]"
                                        required
                                        rules={[
                                            // {
                                            //     required: true,
                                            //     message:
                                            //         messages(
                                            //             'validation.input'
                                            //         ),
                                            // },
                                            {
                                                type: 'number',
                                                min: 1,
                                                message: messages(
                                                    'validation.numberMin',
                                                    {
                                                        number: 1,
                                                    }
                                                ),
                                            },
                                        ]}
                                    >
                                        <InputNumber
                                            placeholder={item.nameVi}
                                            className="!w-full"
                                        />
                                    </AppFormItem>
                                ))}
                            </div>
                        </AppFormItem>
                    )}

                    <AppFormItem
                        name="override"
                        valuePropName="checked"
                        initialValue={false}
                    >
                        <Checkbox>
                            {messages('topic.overWriteExistingValues')}
                        </Checkbox>
                    </AppFormItem>
                </AppForm>
            </AppModal>
        </div>
    );
}
