// 'use client';

// import AppForm from '@/components/ui/antd-form/form';
// import AppFormItem from '@/components/ui/antd-form/form-Item';
// import DndUpload from '@/components/ui/input/dnd-upload';
// import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
// import { TYPE_UPLOAD_BUCKET } from '@/enums/common';
// import { showNotification } from '@/helpers/messages-helper';
// import useModalStore from '@/hooks/use-modal';
// import { Button, Form } from 'antd';
// import { useTranslations } from 'next-intl';
// import { useUploadTemplate } from '../../hooks/use-upload-template';

// type Props = Omit<AppModalProps, 'children'> & {
//     onClose: () => void;
//     onSuccess?: () => void;
// };

// export const TemplateUploadModal = ({
//     onClose,
//     onSuccess,
//     ...props
// }: Props) => {
//     const messages = useTranslations();
//     const [form] = Form.useForm();
//     const { uploadTemplate, isPending: isUploading } = useUploadTemplate();

//     const closeModal = useModalStore((state) => state.closeModal);

//     const onFinish = async (values: any) => {
//         const uploadFile = values?.file?.fileList?.[0];
//         const file = uploadFile?.originFileObj as File;

//         if (!file) {
//             showNotification('error', messages('validation.file'));
//             return;
//         }

//         uploadTemplate({
//             payload: {
//                 file,
//                 createBucketFile: {
//                     folderBucket: {
//                         uploadPurpose: TYPE_UPLOAD_BUCKET.RELEASE_TEMPLATE,
//                     },
//                     file: {
//                         fileName: file.name,
//                         contentType: file.type,
//                         extension: file.name.split('.').pop() || '',
//                         fileSize: file.size,
//                     },
//                 },
//             },
//             onSuccess(e) {
//                 form.resetFields();
//                 closeModal();
//             },
//         });
//     };

//     const handleCancel = () => {
//         form.resetFields();
//         onClose();
//     };

//     return (
//         <AppModal
//             title={messages('release.importTemplate')}
//             onCancel={handleCancel}
//             loading={isUploading}
//             footer={[
//                 <Button
//                     key="cancel"
//                     disabled={isUploading}
//                     onClick={handleCancel}
//                 >
//                     {messages('common.cancel')}
//                 </Button>,
//                 <Button
//                     key="submit"
//                     type="primary"
//                     loading={isUploading}
//                     onClick={form.submit}
//                 >
//                     {messages('common.upload')}
//                 </Button>,
//             ]}
//             {...props}
//         >
//             <AppForm
//                 form={form}
//                 onFinish={onFinish}
//                 showSubmit={false}
//                 layout="vertical"
//                 disabled={isUploading}
//             >
//                 <div className="pb-2 pt-4">
//                     <AppFormItem
//                         name="file"
//                         rules={[
//                             {
//                                 required: true,
//                                 message:
//                                     messages('validation.file') ||
//                                     'Vui lòng chọn file',
//                             },
//                         ]}
//                     >
//                         <DndUpload
//                             accept=".xlsx, .xls"
//                             maxCount={1}
//                             multiple={false}
//                             beforeUpload={() => false}
//                         />
//                     </AppFormItem>
//                 </div>
//             </AppForm>
//         </AppModal>
//     );
// };
