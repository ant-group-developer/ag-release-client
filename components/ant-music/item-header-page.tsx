import { Tooltip } from 'antd';
import { ReactNode } from 'react';

type Props = {
    name: ReactNode;
    value: string | undefined | null;
};

export default function ItemHeaderPage({ name, value }: Props) {
    return (
        <div className="flex max-w-[300px] text-sm sm:max-w-[400px] md:max-w-[500px]">
            <span className="shrink-0">{name}:&nbsp;</span>
            {value ? (
                <Tooltip title={value}>
                    <span className="truncate font-semibold">{value}</span>
                </Tooltip>
            ) : (
                <span className="font-semibold"></span>
            )}
        </div>
    );
}
