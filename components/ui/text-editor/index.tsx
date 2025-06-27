import { cn } from '@/helpers/common';
import dynamic from 'next/dynamic';
import { CustomEditorProps } from './ck-editor';

const CustomEditor = dynamic(
    () => {
        return import('./ck-editor');
    },
    { ssr: false }
);

type Props = CustomEditorProps & { className?: string };

function TextEditor({ className, onChange, value = '' }: Props) {
    return (
        <div className={cn('ck-container', className)}>
            <CustomEditor onChange={onChange} value={value} />
        </div>
    );
}

export default TextEditor;
