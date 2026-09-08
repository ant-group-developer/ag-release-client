import { formattedNumber } from '@/helpers/common';
import { Link } from '@/i18n/routing';
import { Skeleton, Typography, theme } from 'antd';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type StatOverviewItem = {
    label: string;
    count?: number;
    importCount?: number;
    subtext?: ReactNode;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    href?: string;
    isLoading?: boolean;
};

type Props = {
    item: StatOverviewItem;
    importLabel?: string;
};

export default function StatOverviewCard({ item, importLabel }: Props) {
    const { token } = theme.useToken();
    const Icon = item.icon;
    const hasFooter =
        typeof item.importCount === 'number' || Boolean(item.subtext);

    return (
        <div
            className="flex h-full flex-col justify-between rounded-xl border p-3 shadow-sm transition-all hover:shadow-md sm:p-3.5 lg:p-4"
            style={{
                backgroundColor: token.colorBgContainer,
                borderColor: token.colorBorderSecondary,
            }}
        >
            {/* Top section: Label & Icon + Big Number */}
            <div>
                {/* Top row: Label & Icon */}
                <div className="flex items-center justify-between gap-1.5">
                    <Typography.Text
                        type="secondary"
                        className="block truncate text-[11px] font-semibold uppercase tracking-wider sm:text-xs"
                    >
                        {item.label}
                    </Typography.Text>
                    <div
                        className={`shrink-0 rounded-lg p-1.5 sm:rounded-xl sm:p-2 ${item.bgColor} ${item.color}`}
                    >
                        <Icon size={18} className="sm:h-5 sm:w-5" />
                    </div>
                </div>

                {/* Middle row: Big Number */}
                <div>
                    {item.isLoading ? (
                        <Skeleton.Input
                            active
                            size="small"
                            className="my-1 !w-24 sm:!w-28"
                        />
                    ) : (
                        <>
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="block w-fit max-w-full transition-colors hover:text-blue-500"
                                >
                                    <Typography.Text
                                        className="block !text-base font-extrabold leading-none tracking-tight hover:text-blue-500 min-[400px]:text-2xl sm:text-2xl lg:text-3xl"
                                        title={formattedNumber(item.count)}
                                    >
                                        {formattedNumber(item.count)}
                                    </Typography.Text>
                                </Link>
                            ) : (
                                <Typography.Text
                                    className="block !text-base font-extrabold leading-none tracking-tight min-[400px]:text-2xl sm:text-2xl lg:text-3xl"
                                    title={formattedNumber(item.count)}
                                >
                                    {formattedNumber(item.count)}
                                </Typography.Text>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Bottom section: Divider & Footer (always rendered to guarantee uniform height across grid rows) */}
            <div>
                <div
                    className="my-1.5 border-t"
                    style={{
                        borderColor: hasFooter
                            ? token.colorBorderSecondary
                            : 'transparent',
                    }}
                />
                <div className="text-[11px] sm:text-xs">
                    {item.isLoading ? (
                        <Skeleton.Input
                            active
                            size="small"
                            className="!h-3 !w-20"
                        />
                    ) : item.subtext ? (
                        item.subtext
                    ) : typeof item.importCount === 'number' ? (
                        <Typography.Text
                            type="secondary"
                            className="block text-[11px] leading-tight sm:text-xs"
                        >
                            {importLabel}:{' '}
                            <Typography.Text className="font-semibold">
                                {formattedNumber(item.importCount)}
                            </Typography.Text>
                        </Typography.Text>
                    ) : (
                        <Typography.Text
                            type="secondary"
                            className="block text-[11px] leading-tight opacity-0 select-none sm:text-xs"
                            aria-hidden="true"
                        >
                            &nbsp;
                        </Typography.Text>
                    )}
                </div>
            </div>
        </div>
    );
}
