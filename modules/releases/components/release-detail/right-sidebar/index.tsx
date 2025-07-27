'use client';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { getReleaseDetailTabRoute } from '@/helpers/link';
import { useRouter } from '@/i18n/routing';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseValidate } from '@/modules/releases/hooks/release-validate';
import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface RightSidebarProps {}

export default function RightSidebar({ ...props }: RightSidebarProps) {
    // hook - state
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { releaseValidateData } = useReleaseValidate(
        formValues?.id as string
    );
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // router
    const router = useRouter();

    // variables
    const errorCount = releaseValidateData.length;

    // func
    const getFieldLabel = (field: string) => {
        if (!field) return;

        if (field.startsWith('tracks.')) {
            const parts = field.split('.');
            if (parts.length == 3) {
                const trackIndex = Number(parts[1]) + 1;
                const fieldName = parts.slice(2).join('.');
                return `${messages('tracks.number')} ${trackIndex}: ${messages(`formFields.${fieldName}` as any) || field}`;
            }
        }

        return messages(`formFields.${field}` as any);
    };
    const setValidationErrors = useReleaseFormStore(
        (state) => state.setValidationErrors
    );
    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };
    const handleErrorClick = (field: string, page: RELEASES_TABS) => {
        const newUrl = `${getReleaseDetailTabRoute(formValues?.id as string, page)}#${field}`;
        // const newUrl = `/releases/detail/${router.query.id}/err.page#${err.field}`;
        router.push(newUrl);
        setTimeout(() => {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        }, 100);
    };

    // useEffect(() => {
    //     // Thực hiện xác thực
    //     const validationResult = releaseSchema(messages as any).safeParse(
    //         formValues
    //     );

    //     if (!validationResult.success) {
    //         setValidationErrors(validationResult.error.errors);
    //     } else {
    //         setValidationErrors([]);
    //     }
    // }, [formValues]);

    return (
        <div
            className={cn(
                'sticky top-0 h-screen w-[300px] border-x bg-white transition-all duration-300',
                isSidebarOpen ? 'w-[300px]' : 'w-[75px]'
            )}
        >
            {/* Header */}
            <div className="flex h-16 items-center border-b px-3">
                {isSidebarOpen ? (
                    <>
                        <h3 className="grow font-semibold text-red-500">
                            {`${messages('validation.error')} (${errorCount})`}
                        </h3>
                        {
                            <button onClick={toggleSidebar}>
                                <ChevronRight size={SIZE_ICON} />
                            </button>
                        }
                    </>
                ) : (
                    <button onClick={toggleSidebar} className="mx-auto">
                        <ChevronLeft size={SIZE_ICON} />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="h-[calc(100%-4rem)] overflow-auto">
                <div className="p-3">
                    {/* Errors */}
                    <div className="mb-4">
                        {isSidebarOpen && (
                            // <ul className="space-y-2">
                            //     {errors.length > 0 ? (
                            //         errors.map((err, index) => (
                            //             <li
                            //                 key={index}
                            //                 className="rounded-md border border-red-200 bg-red-50 p-2 text-sm"
                            //             >
                            //                 {err.path.length > 0 && (
                            //                     <p className="break-words text-red-600">
                            //                         {getFieldLabel(err.path)}
                            //                     </p>
                            //                 )}
                            //                 <p className="text-xs text-red-500">
                            //                     {err.message}
                            //                 </p>
                            //             </li>
                            //         ))
                            //     ) : (
                            //         <li className="text-sm text-gray-500">
                            //             {messages('validation.noError')}
                            //         </li>
                            //     )}
                            // </ul>
                            <ul className="space-y-2">
                                {releaseValidateData?.length > 0 &&
                                    releaseValidateData?.map((err, index) => (
                                        <li
                                            key={index}
                                            className="group cursor-pointer rounded-md border border-red-200 bg-red-50 p-2 text-sm"
                                            onClick={() =>
                                                handleErrorClick(
                                                    err.field,
                                                    err.page as RELEASES_TABS
                                                )
                                            }
                                        >
                                            <p className="break-words text-red-600 group-hover:underline">
                                                {getFieldLabel(err.field)}
                                            </p>

                                            <p className="text-xs text-red-500 group-hover:underline">
                                                {messages(
                                                    err.messageCode as any
                                                )}
                                            </p>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </div>

                    {/* errors */}
                    {!isSidebarOpen && (
                        <div>
                            <h4 className="mb-2 flex items-center gap-2 text-red-500">
                                <AlertTriangle size={SIZE_ICON} />({errorCount})
                            </h4>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
