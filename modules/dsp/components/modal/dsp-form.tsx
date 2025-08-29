import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconButton from '@/components/ui/button/icon-button';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import ActionsSelect from '@/components/ui/select/actions-select';
import { SIZE_ICON } from '@/constants/common';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Button, Divider, Form, Input, Radio, Spin, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect } from 'react';
import { useCreateDsp } from '../../hooks/use-create-dsp';
import { useGetDetailDsp } from '../../hooks/use-get-detail-dsp';
import { useUpdateDsp } from '../../hooks/use-update-dsp';
import { DspData } from '../../types';
import { CreateDspPayload, UpdateDspPayload } from '../../types/payload';

type DspFormValues = Omit<DspData, 'id' | 'createdAt' | 'updatedAt'> & {
    pictureFile?: any;
};

type Props = Omit<AppModalProps, 'children'> & {};

export default function DspFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const { active, isActive, deActive } = useActive();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as DspData);
    const isUpdate = !!dataEdit?.id;
    const { createDsp } = useCreateDsp();
    const { updateDsp } = useUpdateDsp();
    const { dspData, isLoading: isLoadingDsp } = useGetDetailDsp(dataEdit?.id);
    const isOnLoadingData = isLoadingDsp && !!dataEdit?.id;

    const handleCreateDsp = (values: DspFormValues) => {
        const variables: CreateVariables<CreateDspPayload> = {
            payload: values,
            onSuccess: () => {
                deActive();
                form.resetFields();
                form.setFieldsValue({
                    dspActions: [{ actionId: undefined, isDefault: true }],
                });
            },
            onError: () => {
                deActive();
            },
        };
        createDsp(variables);
    };

    const handleUpdateDsp = (values: DspFormValues) => {
        const variables: UpdateVariables<DspData['id'], UpdateDspPayload> = {
            id: dataEdit?.id,
            payload: values,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateDsp(variables);
    };

    const onFinish = async (values: any) => {
        const { pictureFile, link, ...res } = values;
        const file = values?.pictureFile?.fileList[0]?.originFileObj;
        const oldFile = values?.pictureFile?.fileList[0]?.url;
        let formatLinks = '';
        if (link) {
            formatLinks = link
                .split('\n')
                .map((s: string) => s.trim())
                .filter(Boolean);
        }
        active();
        const payloadValues = { formatLinks, ...res };
        if (file) {
            const dataPayload = {
                entityType: ENTITY_TYPE_PICTURE.DSP,
                fileName: file.name,
                contentType: file.type,
                fileSize: file.size,
            };

            try {
                const urlPublic = await uploadApi.uploadFile({
                    infoFile: dataPayload,
                    file: file,
                });
                if (urlPublic) {
                    payloadValues.picture = urlPublic;
                }
            } catch (error) {
                showNotification(
                    'error',
                    messages('file.message.uploadFileFailed')
                );
                deActive();
                return;
            }
        } else if (!file && !oldFile) {
            // payloadValues.picture = null;
            payloadValues.picture = getAvatarUrl(values?.name);
        }

        return isUpdate
            ? handleUpdateDsp(payloadValues)
            : handleCreateDsp(payloadValues);
    };

    const handleDefaultChange = useCallback(
        (changedIndex: number, isChecked: boolean) => {
            if (!isChecked) return;

            const currentActions = form.getFieldValue('dspActions') || [];
            const updatedActions = currentActions.map(
                (action: any, index: number) => ({
                    ...action,
                    isDefault: index === changedIndex,
                })
            );

            form.setFieldsValue({
                dspActions: updatedActions,
            });
        },
        [form]
    );

    useEffect(() => {
        const initialData = {
            ...dspData,
            link: Array.isArray(dspData?.formatLinks)
                ? dspData.formatLinks.join('\n')
                : dspData?.formatLinks || '',
            pictureFile: dspData?.picture
                ? {
                      fileList: [
                          {
                              uid: dspData?.id,
                              status: 'done',
                              url: dspData?.picture,
                              name: dspData?.name,
                          },
                      ],
                  }
                : undefined,
        };
        if (isUpdate && dspData) {
            form.setFieldsValue(initialData);
        }

        // Nếu là create và chưa có dspActions => thêm 1 item trống
        // if (!isUpdate) {
        //     const current = form.getFieldValue('dspActions');
        //     if (!Array.isArray(current) || current.length === 0) {
        //         form.setFieldsValue({
        //             dspActions: [{ actionId: undefined, isDefault: true }],
        //         });
        //     }
        // }
    }, [isUpdate, form, dspData]);

    return (
        <AppModal
            width={700}
            {...props}
            title={`${isUpdate ? messages('common.update') : messages('common.create')} DSP`}
            open
            onCancel={closeModal}
            okButtonProps={{ disabled: isOnLoadingData }}
            onOk={form.submit}
            loading={isActive}
            className="!top-8"
        >
            <Spin spinning={isOnLoadingData}>
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    showSubmit={false}
                    layout="vertical"
                    disabled={isActive}
                    initialValues={{
                        isActive: false,
                    }}
                >
                    <AppFormItem
                        name="pictureFile"
                        label={messages('common.image')}
                        // required
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: messages('validation.input'),
                        //     },
                        // ]}
                    >
                        <ImageListUpload
                            maxCount={1}
                            accept="image/png,image/jpeg,image/svg+xml,image/x-icon"
                            maxSizeMB={3}
                            description={
                                <ul className="space-y-1 text-xs">
                                    <li className="flex-1 text-sm text-gray-500">
                                        {messages(
                                            'image.validation.supportImageFormat',
                                            {
                                                value: 'PNG, JPG, WEBP, SVG, ICON',
                                            }
                                        )}
                                    </li>
                                    <li className="flex-1 text-sm text-gray-500">
                                        {messages(
                                            'image.validation.mustBeLessThanMB',
                                            {
                                                value: '3',
                                            }
                                        )}
                                    </li>
                                </ul>
                            }
                            disabled={isActive}
                        />
                    </AppFormItem>
                    <AppFormItem
                        name="name"
                        label={messages('dsp.name')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: MAX_NAME_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NAME_LENGTH,
                                    field: messages('dsp.name'),
                                }),
                            },
                            {
                                validator: (_, value) => {
                                    if (value && value.includes('_')) {
                                        return Promise.reject(
                                            messages(
                                                'validation.noUnderscore',
                                                {
                                                    field: messages('dsp.name'),
                                                }
                                            )
                                        );
                                    }
                                    return Promise.resolve();
                                },
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem>

                    <AppFormItem
                        name="link"
                        label={'Format links'}
                        tooltip={messages('dsp.oneLinkPerLine')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: 200,
                                message: messages('validation.stringMax', {
                                    max: 200,
                                    field: 'Format links',
                                }),
                            },
                        ]}
                    >
                        <TextArea
                            allowClear
                            autoSize={{
                                maxRows: 7,
                                minRows: 3,
                            }}
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="isActive"
                        valuePropName="checked"
                        label={
                            <div className="text-wrap pb-2">
                                {messages('status.active')}
                            </div>
                        }
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Switch />
                    </AppFormItem>

                    <Form.List name="dspActions">
                        {(fields, { add, remove }) => (
                            <div className="max-h-[300px] overflow-auto">
                                <Divider />
                                <p className="mb-2 font-semibold">
                                    {messages('common.policies')}
                                </p>
                                {fields.map(({ key, name, ...restField }) => (
                                    <div key={key}>
                                        <div className="relative flex items-center gap-x-4">
                                            <div className="w-3/6">
                                                <AppFormItem
                                                    {...restField}
                                                    name={[name, 'actionId']}
                                                    required
                                                >
                                                    <ActionsSelect allowClear />
                                                </AppFormItem>
                                                <IconButton
                                                    onClick={() => {
                                                        const currentProfiles =
                                                            form.getFieldValue(
                                                                'dspActions'
                                                            ) || [];
                                                        remove(name);
                                                    }}
                                                    className="absolute right-0 top-0"
                                                    disabled={isActive}
                                                >
                                                    <Trash
                                                        size={SIZE_ICON}
                                                        className="text-red-500"
                                                    />
                                                </IconButton>
                                            </div>
                                            <AppFormItem
                                                {...restField}
                                                name={[name, 'isDefault']}
                                            >
                                                <Radio
                                                    defaultChecked={false}
                                                    checked={form.getFieldValue(
                                                        [
                                                            'dspActions',
                                                            name,
                                                            'isDefault',
                                                        ]
                                                    )}
                                                    onChange={(e) =>
                                                        handleDefaultChange(
                                                            name,
                                                            e.target.checked
                                                        )
                                                    }
                                                >
                                                    {messages(
                                                        'common.setIsDefault'
                                                    )}
                                                </Radio>
                                            </AppFormItem>
                                        </div>
                                    </div>
                                ))}
                                <div className="mb-4">
                                    <Button
                                        className="w-full"
                                        type="dashed"
                                        onClick={() =>
                                            add({
                                                actionId: undefined,
                                                isDefault: false,
                                            })
                                        }
                                    >
                                        + {messages('action.create.button')}{' '}
                                        {` ${messages('policy.label').toLowerCase()}`}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Form.List>
                </AppForm>
            </Spin>
        </AppModal>
    );
}
