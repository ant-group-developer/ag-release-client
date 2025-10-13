'use client';
import IconButton from '@/components/ui/button/icon-button';
import { ScrollArea } from '@/components/ui/scroll/scroll-area';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { Link } from '@/i18n/routing';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseValidate } from '@/modules/releases/hooks/release-validate';
import { ReleaseValidate } from '@/modules/releases/types';
import { Alert } from 'antd';
import {
    AlertCircle,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
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
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();

    // router
    // const router = useRouter();

    // variables
    const errorCount = releaseValidateData.length;

    // func
    const getFieldLabel = (field: string, page: string) => {
        if (!field) return;

        switch (page) {
            case RELEASES_TABS.CORE_DETAIL:
                // return `${messages('common.coreInfo')}: ${messages(`formFields.${field}` as any)}`;
                return `${messages(`formFields.${field}` as any)}`;

            case RELEASES_TABS.TRACKS:
                const parts = field.split('.');
                if (parts.length >= 3) {
                    const trackIndex = Number(parts[1]) + 1;
                    const fieldName = parts.slice(2).join('.');
                    return `${messages('track.number')} ${trackIndex}: ${messages(`formFields.${fieldName}` as any) || field}`;
                } else if (field == 'maxTrackCount' || 'maxTrackCount') {
                    return messages('track.label');
                }
                break;

            case RELEASES_TABS.SCHEDULE:
                // return `${messages('release.scheduling.label')}: ${messages(`formFields.${field}` as any)}`;
                return `${messages(`formFields.${field}` as any)}`;

            default:
                return messages(`formFields.${field}` as any);
        }
    };
    const getErrorMessages = (error: ReleaseValidate) => {
        if (error.field == 'maxTrackCount') {
            return messages('formFields.tracks.maxCountTrack', {
                number: error.message,
            });
        } else if (error.field == 'minTrackCount') {
            return messages('formFields.tracks.minCountTrack', {
                number: error.message,
            });
        }

        return messages(error.messageCode as any);
    };
    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };
    // const handleErrorClick = async (field: string, page: RELEASES_TABS) => {
    //     const newUrl = `${getReleaseDetailTabRoute(formValues?.id as string, page)}#${field}`;
    //     // new scroll
    //     await router.push(newUrl);
    //     setTimeout(() => {
    //         const el = document.getElementById(field);
    //         el?.scrollIntoView({
    //             behavior: 'smooth',
    //             block: 'center',
    //             inline: 'center',
    //         });
    //         window.dispatchEvent(new HashChangeEvent('hashchange'));
    //     }, 100);
    // };

    return (
        <div
            className={cn(
                'sticky top-0 h-[calc(100vh-4rem)] w-[300px] shrink-0 border-x bg-white transition-all duration-300',
                isSidebarOpen ? 'w-[300px]' : 'w-[75px]'
            )}
        >
            <div>
                {/* Header */}
                <div className="flex h-16 w-full items-center justify-center border-b px-3">
                    {isSidebarOpen ? (
                        <>
                            <h3 className="grow font-semibold text-red-500">
                                {`${messages('validation.error')} (${errorCount})`}
                            </h3>
                            {
                                <IconButton
                                    className="w-[40px] cursor-pointer"
                                    onClick={toggleSidebar}
                                >
                                    <ChevronRight size={SIZE_ICON} />
                                </IconButton>
                            }
                        </>
                    ) : (
                        <IconButton
                            onClick={toggleSidebar}
                            className="w-[40px] cursor-pointer"
                        >
                            <ChevronLeft size={SIZE_ICON} />
                        </IconButton>
                    )}
                </div>

                {/* Content */}
                {/* <div className="h-[calc(100%-8rem)] overflow-auto"> */}
                <ScrollArea className="h-[86vh]">
                    <div className="w-full max-w-[300px] p-3">
                        {/* Errors */}
                        <div className="mb-4">
                            {isSidebarOpen && (
                                <ul className="flex flex-col gap-1 space-y-2">
                                    {releaseValidateData?.length > 0 &&
                                        releaseValidateData?.map(
                                            (err, index) => {
                                                const label = getFieldLabel(
                                                    err.field,
                                                    err.page
                                                );
                                                return (
                                                    <Link
                                                        key={index}
                                                        href={`${getReleaseTabRoute(formValues?.id as string, err.page as RELEASES_TABS)}#${err.field}`}
                                                        onClick={() => {
                                                            setTimeout(() => {
                                                                window.dispatchEvent(
                                                                    new HashChangeEvent(
                                                                        'hashchange'
                                                                    )
                                                                );
                                                            }, 200);
                                                        }}
                                                    >
                                                        <Alert
                                                            className="custom-alert-sidebar cursor-pointer !px-[14px] !py-3 !text-sm hover:underline"
                                                            // key={index}
                                                            // onClick={() =>
                                                            //     handleErrorClick(
                                                            //         err.field,
                                                            //         err.page as RELEASES_TABS
                                                            //     )
                                                            // }
                                                            message={
                                                                <div className="max-w-full truncate text-sm dark:text-white">
                                                                    <CustomTooltip
                                                                        title={
                                                                            label
                                                                        }
                                                                    >
                                                                        {label}
                                                                    </CustomTooltip>
                                                                </div>
                                                            }
                                                            description={
                                                                <p className="line-clamp-3 text-xs">
                                                                    {getErrorMessages(
                                                                        err
                                                                    )}
                                                                </p>
                                                            }
                                                            type="error"
                                                            showIcon
                                                            icon={
                                                                <AlertCircle
                                                                    size={
                                                                        SIZE_ICON
                                                                    }
                                                                    className="mt-1 text-red-500"
                                                                />
                                                            }
                                                        />
                                                    </Link>
                                                );
                                            }
                                        )}
                                </ul>
                            )}
                        </div>

                        {/* errors */}
                        {!isSidebarOpen && (
                            <div>
                                <h4 className="mb-2 flex items-center gap-2 text-red-500">
                                    <AlertTriangle size={SIZE_ICON} />(
                                    {errorCount})
                                </h4>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                {/* </div> */}
            </div>
        </div>
    );
}
