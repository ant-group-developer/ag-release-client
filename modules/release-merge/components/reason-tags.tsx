'use client';

import { Tag } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    codes?: string[] | null;
};

export default function ReasonTags({ codes }: Props) {
    const messages = useTranslations();
    if (!codes?.length) return null;

    return (
        <div className="flex flex-wrap gap-1">
            {codes.map((code) => {
                const key = `releaseMerge.reasonCode.${code}`;
                const label = messages.has(key as never)
                    ? messages(key as never)
                    : code;
                return (
                    <Tag key={code} className="!mr-0">
                        {label}
                    </Tag>
                );
            })}
        </div>
    );
}

export function CodeList({ codes }: { codes?: string[] | null }) {
    if (!codes?.length) return <>-</>;
    const shown = codes.slice(0, 8);
    return (
        <div className="flex flex-wrap gap-1">
            {shown.map((code) => (
                <Tag key={code} className="!mr-0">
                    {code}
                </Tag>
            ))}
            {codes.length > shown.length && (
                <Tag className="!mr-0">+{codes.length - shown.length}</Tag>
            )}
        </div>
    );
}
