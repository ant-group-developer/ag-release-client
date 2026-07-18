import AppForm from '@/components/ui/antd-form/form';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { uploadApi } from '@/modules/upload/apis';
import { ENTITY_TYPE_PICTURE } from '@/modules/upload/types/data';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Spin, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { TYPE_MODAL_DSP, DSP_TYPE } from '../../enums';
import { useCreateDsp } from '../../hooks/use-create-dsp';
import { useGetDetailDsp } from '../../hooks/use-get-detail-dsp';
import { useUpdateDsp } from '../../hooks/use-update-dsp';
import { DspData } from '../../types';
import { CreateDspPayload, UpdateDspPayload } from '../../types/payload';
import DspDeals from './dsp-deals';
import DspGeneral from './dsp-general';
import DspPolicies from './dsp-policies';

type DspFormValues = Omit<DspData, 'id' | 'createdAt' | 'updatedAt'> & {
    pictureFile?: any;
};

type Props = Omit<AppModalProps, 'children'> & {};

export default function DspFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const { active, isActive, deActive } = useActive();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore<DspData>((state) => state.dataEdit);
    const typeModal = useModalStore((state) => state.typeModal);
    const isUpdate = !!dataEdit?.id;
    const isCreateForm = typeModal === TYPE_MODAL_DSP.CREATE;
    const { createDsp } = useCreateDsp();
    const { updateDsp } = useUpdateDsp();
    const { dspData, isLoading: isLoadingDsp } = useGetDetailDsp(dataEdit?.id);
    const isOnLoadingData = isLoadingDsp && !!dataEdit?.id;
    const [activeTab, setActiveTab] = useState<string>('');
    const { isAdmin } = useAuth();

    const handleCreateDsp = (values: DspFormValues) => {
        const variables: CreateVariables<CreateDspPayload> = {
            payload: values,
            onSuccess: () => {
                deActive();
                form.resetFields();
                // form.setFieldsValue({
                //     dspActions: [{ actionId: undefined, isDefault: true }],
                // });
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

    const dspTabs: TabsProps['items'] = [
        {
            key: 'general',
            label: messages('common.general'),
            children: <DspGeneral form={form} isActive={isActive} />,
        },
        ...(isAdmin
            ? [
                  {
                      key: 'Policies',
                      label: messages('policy.policies'),
                      children: <DspPolicies form={form} isActive={isActive} />,
                  },
                  {
                      key: 'Deals',
                      label: messages('common.deals'),
                      children: <DspDeals dspId={dspData?.id} />,
                      disabled: isCreateForm,
                  },
              ]
            : []),
    ];

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
    }, [isUpdate, form, dspData]);

    return (
        <AppModal
            width={'40vw'}
            {...props}
            title={`${isUpdate ? messages('common.update') : messages('common.create')} DSP`}
            open
            onCancel={closeModal}
            okButtonProps={{ disabled: isOnLoadingData }}
            onOk={form.submit}
            loading={isActive}
            className="!top-8"
            footer={false}
        >
            <Spin spinning={isOnLoadingData}>
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    layout="horizontal"
                    disabled={isActive}
                    initialValues={{
                        isActive: true,
                        hasDeal: false,
                        enablePolicy: false,
                        isDefault: false,
                        type: DSP_TYPE.AUDIO,
                    }}
                    submitProps={{
                        loading: isActive,
                        className: 'mt-4',
                    }}
                    showSubmit={activeTab !== 'Deals'}
                >
                    <Tabs items={dspTabs} onChange={setActiveTab}></Tabs>
                </AppForm>
            </Spin>
        </AppModal>
    );
}
