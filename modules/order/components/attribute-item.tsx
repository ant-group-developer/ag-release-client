export default function AttributeItem({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) {
    if (!value) return null;
    return (
        <div className="flex flex-col">
            <p className="font-bold text-gray-500">{label}</p>
            <p>{value}</p>
        </div>
    );
}
