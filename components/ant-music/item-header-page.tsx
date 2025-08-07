type Props = {
    name: string;
    value: string;
};

export default function ItemHeaderPage({ name, value }: Props) {
    return (
        <div className="text-sm">
            <span>{name}: </span>
            <span className="font-bold">{value}</span>
        </div>
    );
}
