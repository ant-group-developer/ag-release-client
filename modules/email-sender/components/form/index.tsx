import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import FileUpload from '@/components/ui/input/fileUpload';
import TextEditor from '@/components/ui/text-editor';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {};

export default function EmailSenderForm({}: Props) {
    const messages = useTranslations();
    return (
        <div>
            <AppForm layout="vertical" submitText={messages('common.send')}>
                <AppFormItem
                    name="title"
                    label={messages('common.title')}
                    required
                >
                    <Input />
                </AppFormItem>
                <AppFormItem
                    name="content"
                    label={messages('common.content')}
                    required
                >
                    <TextEditor className="editor-large" />
                </AppFormItem>

                <AppFormItem
                    name="fileAttach"
                    label={messages('file.fileAttach')}
                >
                    <FileUpload maxCount={10} multiple />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
