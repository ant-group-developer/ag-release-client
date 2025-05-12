import TextArea from 'antd/es/input/TextArea';

interface Props {
    className?: string;
    note?: string;
    title?: string;
}

export default function ProductNote({ className, note, title }: Props) {
    if (!note) return null;
    return (
        <div className={className}>
            <p className="py-2 text-base font-bold">{title}</p>
            <div>
                <TextArea
                    readOnly
                    autoSize={{ minRows: 3, maxRows: 7 }}
                    value={note}
                />
            </div>
        </div>
    );
}
