'use client';

import IconButton from '@/components/ui/button/icon-button';
import { ScrollArea } from '@/components/ui/scroll/scroll-area';
import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/common';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { RELEASE_ROUTE_ACTION } from '@/modules/releases/enums';
import { RELEASE_DETAIL_ACTION } from '@/modules/releases/helpers/link';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useReleaseValidate } from '@/modules/releases/hooks/release-validate';
import { useReleaseEnrichedErrors } from '@/modules/releases/hooks/use-release-enriched-errors';
import { Grid, theme } from 'antd';
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EnrichedErrorList from './enriched-error-list';
import ValidateErrorList from './validate-error-list';

interface RightSidebarProps {}

export default function RightSidebar({ ...props }: RightSidebarProps) {
    // hook - state
    const params = useParams();
    const isCreateReleasePage = params['action'] == RELEASE_ROUTE_ACTION.CREATE;
    const messages = useTranslations();
    const releaseAction = useReleaseActionStore((state) => state.action);
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { releaseValidateData, isFetching } = useReleaseValidate(
        formValues?.id as string
    );
    const { releaseEnrichedErrorsData, isFetching: isFetchingEnrichedErrors } =
        useReleaseEnrichedErrors({
            id: formValues?.id as string,
            isFixed: false,
        });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { token } = theme.useToken();

    // variables
    const validateErrorCount = releaseValidateData.length;
    const enrichedErrorCount = releaseEnrichedErrorsData.length;
    const errorCount = validateErrorCount + enrichedErrorCount;
    const isFetchingErrors = isFetching || isFetchingEnrichedErrors;

    const toggleSidebar = () => {
        setIsSidebarOpen((prevState) => !prevState);
    };

    useEffect(() => {
        if (isCreateReleasePage || !screens.lg) {
            setIsSidebarOpen(false);
            return;
        }

        if (releaseAction === RELEASE_DETAIL_ACTION.READ) {
            setIsSidebarOpen(false);
        } else if (releaseAction === RELEASE_DETAIL_ACTION.EDIT) {
            setIsSidebarOpen(true);
        }
    }, [isCreateReleasePage, screens.lg, releaseAction]);

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
                                    'flex flex-1 items-center gap-2 overflow-hidden text-nowrap font-semibold text-red-500 transition-all duration-200',
                                    isSidebarOpen
                                        ? 'w-auto opacity-100'
                                        : 'w-0 opacity-0'
                                )}
                            >
                                <span className="truncate">
                                    {`${messages('common.errorList')} (${errorCount})`}
                                </span>
                                {isFetchingErrors && (
                                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                                )}
                            </h3>
                            <IconButton
                                className="w-[40px] cursor-pointer"
                                onClick={toggleSidebar}
                            >
                                <ChevronRight size={SIZE_ICON} />
                            </IconButton>
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
                <ScrollArea className="h-[86vh]">
                    <div className="w-full max-w-[300px] p-3">
                        {/* Errors */}
                        {!isSidebarOpen && (
                            <div>
                                <h4 className="mb-2 flex items-center gap-2 text-red-500">
                                    {isFetchingErrors ? (
                                        <Loader2
                                            size={SIZE_ICON}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <AlertTriangle size={SIZE_ICON} />
                                    )}
                                    ({errorCount})
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
                                    <ValidateErrorList
                                        errors={releaseValidateData}
                                        isFetching={isFetching}
                                        releaseId={formValues?.id as string}
                                        sectionColor={token.colorError}
                                        title={messages('validation.error')}
                                    />
                                    <EnrichedErrorList
                                        errors={releaseEnrichedErrorsData}
                                        isFetching={isFetchingEnrichedErrors}
                                        releaseId={formValues?.id as string}
                                        sectionColor={token.colorError}
                                        title={messages('release.releaseError')}
                                    />
                                </ul>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
