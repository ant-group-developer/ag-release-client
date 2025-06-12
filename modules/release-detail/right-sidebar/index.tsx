'use client';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { fieldLabels } from '@/modules/releases/constants/fieldLabels';
import { XCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ZodIssue } from 'zod';

interface RightSidebarProps {
    errors: ZodIssue[];
}

export default function RightSidebar({ errors }: RightSidebarProps) {
    const messages = useTranslations();
    const errorCount = errors.length;

    const getFieldLabel = (path: (string | number)[]) => {
        if (!path.length) return;

        if (path[0] === 'tracks' && path[1] === 'number') {
            const trackNum = Number(path[1]) + 1;
            const field = path[2];
            const fieldKey = `tracks.${field}`;
            return `${fieldLabels[fieldKey] || field} (${messages('tracks.label').toLocaleLowerCase()} ${messages('common.number').toLocaleLowerCase()} ${trackNum})`;
        }
    };

    return (
        <div
            className={cn(
                'h-screen w-[300px] border-x bg-white transition-all duration-300'
                // isActive ? 'w-[250px]' : 'w-[50px]'
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center border-b px-3">
                {/* {isActive ? ( */}
                <>
                    <h3 className="grow font-semibold">Validation Issues</h3>
                    {/* <button onClick={toggleActive}>
                        <ChevronRight size={SIZE_ICON} />
                    </button> */}
                </>
                {/* ) : (
                    <button onClick={toggleActive} className="mx-auto">
                        <ChevronLeft size={SIZE_ICON} />
                    </button>
                )} */}
            </div>

            {/* Content */}
            <div className="h-[calc(100%-8rem)] overflow-auto">
                <div className="p-3">
                    {/* Errors */}
                    <div className="mb-4">
                        <h4 className="mb-2 flex items-center gap-2 font-semibold text-red-500">
                            <XCircle size={SIZE_ICON} />
                            Errors ({errorCount})
                        </h4>
                        <ul className="space-y-2">
                            {errors.length > 0 ? (
                                errors.map((err, index) => (
                                    <li
                                        key={index}
                                        className="rounded-md border border-red-200 bg-red-50 p-2 text-sm"
                                    >
                                        <p className="text-xs text-red-500">
                                            {err.message}
                                        </p>
                                        {err.path.length > 0 && (
                                            <p className="text-red-600">
                                                Field: {err.path.join('.')}
                                            </p>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <li className="text-sm text-gray-500">
                                    Không có lỗi xác thực.
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Warnings */}
                    {/* <div>
                        <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-500">
                            <AlertTriangle size={SIZE_ICON} />
                            Warnings ({warningCount})
                        </h4>
                        <ul className="space-y-2">
                            {warningCount === 0 ? (
                                <li className="text-sm text-gray-500">
                                    Không có cảnh báo.
                                </li>
                            ) : (
                                <>
                                </>
                            )}
                        </ul>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
