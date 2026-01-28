'use client';
import AppForm from '@/components/ui/antd-form/form';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables } from '@/types/api';
import { Form, Tabs } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useBulkCreatePermission } from '../../hooks/use-bulk-create-permission';
import { BulkCreatePermissionPayload } from '../../types/payload';
import PermissionExcelImport, {
    PermissionImportRowWithValidation,
} from './permission-excel-import';
import PermissionManualCreate from './permission-manual-create';

type Props = Omit<AppModalProps, 'children'>;

type TabKey = 'manual' | 'import';

export default function PermissionCreateModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { active, deActive, isActive } = useActive();
    const closeModal = useModalStore((state) => state.closeModal);

    const [activeTab, setActiveTab] = useState<TabKey>('manual');
    const [importData, setImportData] = useState<
        PermissionImportRowWithValidation[]
    >([]);

    const { bulkCreatePermission } = useBulkCreatePermission();

    const handleCreatePermission = (values: any) => {
        const variables: CreateVariables<BulkCreatePermissionPayload> = {
            payload: values,
            onSuccess: () => {
                form.setFieldsValue({
                    permissions: [{ name: '', code: '', note: '' }],
                });
                setImportData([]);
                deActive();
                closeModal();
            },
            onError: () => {
                deActive();
            },
        };
        bulkCreatePermission(variables);
    };

    const handleImportSubmit = () => {
        if (importData.length === 0) return;

        active();
        const payload: BulkCreatePermissionPayload = {
            permissions: importData.map((item) => ({
                name: item.name,
                code: item.code,
                note: item.note,
            })),
        };

        const variables: CreateVariables<BulkCreatePermissionPayload> = {
            payload,
            onSuccess: () => {
                setImportData([]);
                deActive();
                closeModal();
            },
            onError: () => {
                deActive();
            },
        };
        bulkCreatePermission(variables);
    };

    const onFinish = (values: any) => {
        active();
        handleCreatePermission(values);
    };

    const handleOk = () => {
        if (activeTab === 'manual') {
            form.submit();
        } else {
            handleImportSubmit();
        }
    };

    useEffect(() => {
        setTimeout(() => {
            form.setFieldsValue({
                permissions: [{ name: '', code: '', note: '' }],
            });
        }, 0);
    }, [form]);

    const tabItems = [
        {
            key: 'manual',
            label: messages('permission.create.manual'),
            children: (
                <div className="max-h-[calc(100vh-300px)] overflow-auto">
                    <PermissionManualCreate />
                </div>
            ),
        },
        {
            key: 'import',
            label: messages('permission.create.import'),
            children: (
                <PermissionExcelImport
                    data={importData}
                    setData={setImportData}
                />
            ),
        },
    ];

    return (
        <AppModal
            open
            width={1000}
            {...props}
            className="!top-10"
            title={`${messages('common.create')} ${messages('permission.label').toLowerCase()}`}
            onCancel={closeModal}
            onOk={handleOk}
            loading={isActive}
            okButtonProps={{
                disabled:
                    activeTab === 'import' &&
                    (importData.length === 0 ||
                        importData.some((row) => !row.isValid)),
            }}
        >
            <AppForm
                form={form}
                onFinish={onFinish}
                showSubmit={false}
                layout="horizontal"
                disabled={isActive}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key as TabKey)}
                    items={tabItems}
                />
            </AppForm>
        </AppModal>
    );
}
