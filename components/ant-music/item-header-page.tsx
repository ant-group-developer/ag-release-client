import { ReactNode } from 'react';

type Props = {
    name: ReactNode;
    value: string | undefined | null;
};

export default function ItemHeaderPage({ name, value }: Props) {
    return (
        <div className="text-sm">
            <span>{name}: </span>
            <span className="font-bold">{value ?? ''}</span>
        </div>
    );
}
