import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input, Select, Switch, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { TYPE_MODAL_FTP_EXCLUDE_PATTERN, PATTERN_TYPE, FTP_EXCLUDE_PATTERN_SCOPE } from '../../enums';
import { useCreateFtpExcludePattern } from '../../hooks/use-create';
import { useGetDetailFtpExcludePattern } from '../../hooks/use-get-detail';
import { useUpdateFtpExcludePattern } from '../../hooks/use-update';
import { FtpExcludePatternData } from '../../types';
import {
    CreateFtpExcludePatternPayload,
    UpdateFtpExcludePatternPayload,
} from '../../types/payload';

type FtpExcludePatternFormValues = {
    pattern: string;
    patternType: PATTERN_TYPE;
    scope: FTP_EXCLUDE_PATTERN_SCOPE;
    isActive: boolean;
    description: string;
};

type Props = Omit<AppModalProps, 'children'>;

const PATTERN_TYPE_OPTIONS = [
    { label: 'Contains', value: PATTERN_TYPE.CONTAINS },
    { label: 'Regex', value: PATTERN_TYPE.REGEX },
];

const SCOPE_OPTIONS = [
    { label: 'Folder', value: FTP_EXCLUDE_PATTERN_SCOPE.FOLDER },
    { label: 'File', value: FTP_EXCLUDE_PATTERN_SCOPE.FILE },
];

export default function FtpExcludePatternForm({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<FtpExcludePatternFormValues>();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore<FtpExcludePatternData>((state) => state.dataEdit);
    const isUpdateForm = typeModal === TYPE_MODAL_FTP_EXCLUDE_PATTERN.UPDATE;
    const patternId = isUpdateForm ? dataEdit?.id : undefined;

    const { createFtpExcludePattern, isPending: isCreatePending } =
        useCreateFtpExcludePattern();
    const { updateFtpExcludePattern, isPending: isUpdatePending } =
        useUpdateFtpExcludePattern();
    const { ftpExcludePatternData, isFetching } =
        useGetDetailFtpExcludePattern(patternId);

    const buildPayload = (
        values: FtpExcludePatternFormValues
    ): CreateFtpExcludePatternPayload => ({
        pattern: values.pattern,
        patternType: values.patternType,
        scope: values.scope,
        isActive: values.isActive,
        description: values.description ?? '',
    });

    const handleCreate = (values: FtpExcludePatternFormValues) => {
        const variables: CreateVariables<CreateFtpExcludePatternPayload> = {
            payload: buildPayload(values),
            onSuccess: () => {
                form.resetFields();
                deActive();
                closeModal();
            },
            onError: deActive,
        };

        createFtpExcludePattern(variables);
    };

    const handleUpdate = (values: FtpExcludePatternFormValues) => {
        const variables: UpdateVariables<
            FtpExcludePatternData['id'],
            UpdateFtpExcludePatternPayload
        > = {
            id: dataEdit?.id,
            payload: buildPayload(values),
            onSuccess: () => {
                deActive();
                closeModal();
            },
            onError: deActive,
        };

        updateFtpExcludePattern(variables);
    };

    const onFinish = (values: FtpExcludePatternFormValues) => {
        active();
        return isUpdateForm ? handleUpdate(values) : handleCreate(values);
    };

    useEffect(() => {
        if (isUpdateForm && ftpExcludePatternData) {
            form.setFieldsValue({
                pattern: ftpExcludePatternData.pattern,
                patternType: ftpExcludePatternData.patternType as PATTERN_TYPE,
                scope: ftpExcludePatternData.scope as FTP_EXCLUDE_PATTERN_SCOPE,
                isActive:
                    ftpExcludePatternData.isActive === 1 ||
                    (ftpExcludePatternData.isActive as any) === true,
                description: ftpExcludePatternData.description,
            });
        } else if (!isUpdateForm) {
            form.setFieldsValue({
                isActive: true,
                patternType: PATTERN_TYPE.CONTAINS,
                scope: FTP_EXCLUDE_PATTERN_SCOPE.FOLDER,
            });
        }
    }, [isUpdateForm, form, ftpExcludePatternData]);

    const modalTitle = isUpdateForm
        ? messages('reportConfigs.sftpExcludePatterns.action.update')
        : messages('reportConfigs.sftpExcludePatterns.action.create');

    return (
        <AppModal
            {...props}
            open
            centered
            title={modalTitle}
            width={520}
            onCancel={closeModal}
            onOk={form.submit}
            loading={isCreatePending || isUpdatePending}
        >
            <Spin spinning={isFetching}>
                <AppForm
                    form={form}
                    showSubmit={false}
                    onFinish={onFinish}
                    layout="vertical"
                    disabled={isActive}
                >
                    <AppFormItem
                        name="pattern"
                        label={messages('reportConfigs.sftpExcludePatterns.pattern')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear placeholder=".removed_at" />
                    </AppFormItem>

                    <AppFormItem
                        name="patternType"
                        label={messages('reportConfigs.sftpExcludePatterns.patternType')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Select options={PATTERN_TYPE_OPTIONS} />
                    </AppFormItem>

                    <AppFormItem
                        name="scope"
                        label={messages('reportConfigs.sftpExcludePatterns.scope')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Select options={SCOPE_OPTIONS} />
                    </AppFormItem>

                    <AppFormItem
                        name="description"
                        label={messages('reportConfigs.sftpExcludePatterns.description')}
                    >
                        <Input.TextArea allowClear rows={3} />
                    </AppFormItem>

                    <AppFormItem
                        name="isActive"
                        label={messages('reportConfigs.sftpExcludePatterns.isActive')}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={messages('status.enable')}
                            unCheckedChildren={messages('status.disable')}
                        />
                    </AppFormItem>
                </AppForm>
            </Spin>
        </AppModal>
    );
}
