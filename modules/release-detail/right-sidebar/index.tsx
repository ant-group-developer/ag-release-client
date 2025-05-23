'use client';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { useActive } from '@/hooks/use-active';
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    XCircle,
} from 'lucide-react';

export default function RightSidebar() {
    const { isActive, toggleActive } = useActive(false);

    // Số lượng lỗi và cảnh báo (có thể thay bằng dữ liệu thực tế)
    const errorCount = 2;
    const warningCount = 1;

    return (
        <div
            className={cn(
                'fixed right-0 top-16 z-20 h-screen border-x bg-white transition-all duration-300',
                isActive ? 'w-[250px]' : 'w-[50px]'
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center border-b px-3">
                {isActive ? (
                    <>
                        <h3 className="grow font-semibold">
                            Validation Issues
                        </h3>
                        <button onClick={toggleActive}>
                            <ChevronRight size={SIZE_ICON} />
                        </button>
                    </>
                ) : (
                    <button onClick={toggleActive} className="mx-auto">
                        <ChevronLeft size={SIZE_ICON} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="h-[calc(100%-4rem)] overflow-auto">
                {isActive ? (
                    <div className="p-3">
                        {/* Errors */}
                        <div className="mb-4">
                            <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-500">
                                <XCircle size={SIZE_ICON} />
                                Errors ({errorCount})
                            </h4>
                            <ul className="space-y-2">
                                <li className="rounded-md border border-red-200 bg-red-50 p-2 text-sm">
                                    <p className="text-red-700">
                                        Release title is required
                                    </p>
                                    <p className="text-xs text-red-500">
                                        Field: title
                                    </p>
                                </li>
                                <li className="rounded-md border border-red-200 bg-red-50 p-2 text-sm">
                                    <p className="text-red-700">
                                        Invalid release date
                                    </p>
                                    <p className="text-xs text-red-500">
                                        Field: releaseDate
                                    </p>
                                </li>
                            </ul>
                        </div>

                        {/* Warnings */}
                        <div>
                            <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-500">
                                <AlertTriangle size={SIZE_ICON} />
                                Warnings ({warningCount})
                            </h4>
                            <ul className="space-y-2">
                                <li className="rounded-md border border-amber-200 bg-amber-50 p-2 text-sm">
                                    <p className="text-amber-700">
                                        Cover art resolution is low
                                    </p>
                                    <p className="text-xs text-amber-500">
                                        Field: coverArt
                                    </p>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-4 pt-4">
                        {/* Error icon */}
                        <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                                <XCircle
                                    size={SIZE_ICON}
                                    className="text-red-500"
                                />
                            </div>
                            <span className="text-xs font-semibold text-red-500">
                                {errorCount}
                            </span>
                        </div>

                        {/* Warning icon */}
                        <div className="flex flex-col items-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                                <AlertTriangle
                                    size={SIZE_ICON}
                                    className="text-amber-500"
                                />
                            </div>
                            <span className="text-xs font-semibold text-amber-500">
                                {warningCount}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
