'use client';

import { formattedNumber } from '@/helpers/common';
import { theme, Typography } from 'antd';
import { useState } from 'react';

export interface MetricHeaderTabItem<T extends string = string> {
    key: T;
    label: string;
    value: number | string;
    icon?: React.ComponentType<{ size?: number | string; className?: string }>;
    color?: string;
    bgColor?: string;
}

export interface MetricHeaderTabProps {
    label: string;
    value: number | string;
    isActive: boolean;
    onClick: () => void;
    icon?: React.ComponentType<{ size?: number | string; className?: string }>;
    color?: string;
    bgColor?: string;
}

export function MetricHeaderTab({
    label,
    value,
    isActive,
    onClick,
    icon: Icon,
    color,
    bgColor,
}: MetricHeaderTabProps) {
    const { token } = theme.useToken();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative cursor-pointer border-r px-6 py-4 transition-all last:border-r-0"
            style={{
                borderColor: token.colorBorderSecondary,
                backgroundColor: isActive
                    ? isHovered
                        ? token.colorFillSecondary
                        : token.colorFillAlter
                    : isHovered
                      ? token.controlItemBgHover
                      : token.colorBgContainer,
            }}
        >
            {isActive && (
                <div
                    className="absolute left-0 right-0 top-0 h-1"
                    style={{ backgroundColor: token.colorPrimary }}
                />
            )}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <Typography.Text
                        type="secondary"
                        className="text-xs font-bold"
                    >
                        {label}
                    </Typography.Text>
                    <Typography.Title level={3} style={{ margin: 0 }}>
                        {typeof value === 'string'
                            ? value
                            : formattedNumber(value)}
                    </Typography.Title>
                </div>
                {Icon && (
                    <div
                        className={`rounded-xl p-2.5 ${bgColor || ''} ${color || ''}`}
                    >
                        <Icon size={20} />
                    </div>
                )}
            </div>
        </div>
    );
}

export interface MetricHeaderTabsProps<T extends string = string> {
    items: MetricHeaderTabItem<T>[];
    activeKey: T;
    onChangeKey: (key: T) => void;
    className?: string;
}

export default function MetricHeaderTabs<T extends string = string>({
    items,
    activeKey,
    onChangeKey,
    className,
}: MetricHeaderTabsProps<T>) {
    const { token } = theme.useToken();

    const gridColsClass =
        items.length === 2
            ? 'md:grid-cols-2'
            : items.length === 3
              ? 'md:grid-cols-3'
              : items.length === 4
                ? 'md:grid-cols-4'
                : 'md:grid-cols-3';

    return (
        <div
            className={`grid grid-cols-1 overflow-hidden rounded-t-md border-b ${gridColsClass} ${className || ''}`}
            style={{
                borderColor: token.colorBorderSecondary,
                backgroundColor: token.colorBgContainer,
            }}
        >
            {items.map((item) => (
                <MetricHeaderTab
                    key={item.key}
                    label={item.label}
                    value={item.value}
                    icon={item.icon}
                    color={item.color}
                    bgColor={item.bgColor}
                    isActive={activeKey === item.key}
                    onClick={() => onChangeKey(item.key)}
                />
            ))}
        </div>
    );
}
