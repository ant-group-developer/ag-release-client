'use client';
import IconButton from '@/components/ui/button/icon-button';
import { ScrollArea } from '@/components/ui/scroll/scroll-area';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
import { Link } from '@/i18n/routing';
import {
    RELEASE_ROUTE_ACTION,
    RELEASES_TABS,
    TYPE_MODAL_RELEASE,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseValidate } from '@/modules/releases/hooks/release-validate';
import { ReleaseValidate } from '@/modules/releases/types';
import { Alert, Grid, theme } from 'antd';
import {
    AlertCircle,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
interface RightSidebarProps {}

export default function RightSidebar({ ...props }: RightSidebarProps) {
    // hook - state
    const params = useParams();
    const isCreateReleasePage = params['action'] == RELEASE_ROUTE_ACTION.CREATE;
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { releaseValidateData } = useReleaseValidate(
        formValues?.id as string
    );

    const openModal = useModalStore((state) => state.openModal);
    const validateLength = releaseValidateData && releaseValidateData?.length;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { token } = theme.useToken();

    // router
    // const router = useRouter();

    // variables
    const errorCount = releaseValidateData.length;

    // func
    const getFieldLabel = (field: string, page: string) => {
        if (!field) return;

        if (field === 'releaseTerritory') {
            return messages('formFields.territoryType' as any);
        }

        const safeMessage = (key: string) => {
            try {
                return messages(key as any);
            } catch {
                return field;
            }
        };

        switch (page) {
            case RELEASES_TABS.CORE_DETAIL:
                // return `${messages('common.coreInfo')}: ${messages(`formFields.${field}` as any)}`;
                return `${safeMessage(`formFields.${field}`)}`;

            case RELEASES_TABS.TRACKS:
                const parts = field.split('.');
                if (parts.length >= 3) {
                    const trackIndex = Number(parts[1]) + 1;
                    const fieldName = parts.slice(2).join('.');
                    return `${messages('track.label')} ${trackIndex}: ${safeMessage(`formFields.${fieldName}`) || field}`;
                } else if (
                    field === 'maxTrackCount' ||
                    field === 'minTrackCount'
                ) {
                    return messages('track.label');
                }
                break;

            case RELEASES_TABS.SCHEDULE:
                // return `${messages('release.scheduling.label')}: ${messages(`formFields.${field}` as any)}`;
                return `${safeMessage(`formFields.${field}`)}`;

            default:
                return safeMessage(`formFields.${field}`);
        }
    };

    const getErrorMessages = (error: ReleaseValidate) => {
        return messages(error.messageCode as any);
    };
    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };
    const handleClickError = (err: ReleaseValidate) => {
        if (!err?.trackId || !err?.field) return;
        const parts = err.field.split('.');
        const trackIndex = Number(parts[1]);

        openModal(TYPE_MODAL_RELEASE.DETAIL_TRACK_RELEASE, {
            trackId: err.trackId,
            index: trackIndex,
            focusField: err.field,
        });
    };

    useEffect(() => {
        if (isCreateReleasePage || !screens.lg) {
            setIsSidebarOpen(false);
            return;
        }

        if (validateLength > 0) {
            setIsSidebarOpen(true);
        } else {
            setIsSidebarOpen(false);
        }
    }, [validateLength, isCreateReleasePage, screens.lg]);

    return (
        <div
            className={cn(
                'sticky top-0 h-[calc(100vh-4rem)] w-[300px] shrink-0 border-l border-r transition-all duration-300',
                isSidebarOpen ? 'w-[300px]' : 'w-[75px]'
            )}
            style={{
                backgroundColor: token.colorBgContainer,
                borderColor: token.colorBorderSecondary,
            }}
        >
            <div>
                {/* Header */}
                <div
                    className="flex h-16 w-full items-center justify-center border-b px-3"
                    style={{
                        borderColor: token.colorBorderSecondary,
                    }}
                >
                    {isSidebarOpen ? (
                        <>
                            <h3
                                className={cn(
                                    'flex-1 text-nowrap font-semibold text-red-500 transition-all duration-200',
                                    isSidebarOpen
                                        ? 'w-auto opacity-100'
                                        : 'w-0 overflow-hidden opacity-0'
                                )}
                            >
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
                        {!isSidebarOpen && (
                            <div>
                                <h4 className="mb-2 flex items-center gap-2 text-red-500">
                                    <AlertTriangle size={SIZE_ICON} />(
                                    {errorCount})
                                </h4>
                            </div>
                        )}
                        <div className="mb-4">
                            {isSidebarOpen && (
                                <ul
                                    className={cn(
                                        'flex flex-col gap-1 space-y-2 transition-opacity duration-200',
                                        isSidebarOpen
                                            ? 'opacity-100 delay-100'
                                            : 'pointer-events-none opacity-0'
                                    )}
                                >
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
                                                        href={`${getReleaseTabRoute(formValues?.id as string, err.page as RELEASES_TABS)}#${err.field}${err?.trackId ? `.${err.trackId}` : ''}`}
                                                        scroll={false}
                                                        onClick={() => {
                                                            handleClickError(
                                                                err
                                                            );
                                                        }}
                                                    >
                                                        <Alert
                                                            className="custom-alert-sidebar cursor-pointer !px-[14px] !py-3 !text-sm hover:underline"
                                                            message={
                                                                <div className="max-w-full truncate text-xs font-medium dark:text-white">
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
                                                                <p
                                                                    className="line-clamp-3 text-xs"
                                                                    title={getErrorMessages(
                                                                        err
                                                                    )}
                                                                >
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
                    </div>
                </ScrollArea>
                {/* </div> */}
            </div>
        </div>
    );
}
