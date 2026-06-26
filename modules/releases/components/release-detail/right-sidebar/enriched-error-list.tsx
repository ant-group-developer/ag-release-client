'use client';

import IconButton from '@/components/ui/button/icon-button';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { Link } from '@/i18n/routing';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useBulkUpdateReleaseErrors } from '@/modules/releases/hooks/use-bulk-update-release-errors';
import { ReleaseEnrichedError } from '@/modules/releases/types';
import { Checkbox, Popconfirm } from 'antd';
import { ListChecks, Loader2, PackageX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import ErrorAlert from './error-alert';
import SectionTitle from './section-title';

interface EnrichedErrorListProps {
    errors: ReleaseEnrichedError[];
    isFetching: boolean;
    releaseId: string;
    sectionColor: string;
    title: string;
}

export default function EnrichedErrorList({
    errors,
    isFetching,
    releaseId,
    sectionColor,
    title,
}: EnrichedErrorListProps) {
    const messages = useTranslations();
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const { bulkUpdateReleaseErrors, isPending } = useBulkUpdateReleaseErrors();
    const [updatingErrorId, setUpdatingErrorId] = useState<
        ReleaseEnrichedError['id'] | null
    >(null);
    const [isUpdatingAll, setIsUpdatingAll] = useState(false);

    const count = errors.length;
    if (count <= 0) return null;

    const getEnrichedErrorMessages = (error: ReleaseEnrichedError) => {
        return error.message || messages(error.messageCode as any);
    };

    const handleUpdateError = (event: any, id: ReleaseEnrichedError['id']) => {
        event.preventDefault();
        event.stopPropagation();

        setUpdatingErrorId(id);
        bulkUpdateReleaseErrors({
            payload: {
                items: [
                    {
                        id: id,
                        isFixed: true,
                    },
                ],
            },
            onSuccess: () => {
                setUpdatingErrorId(null);
            },
            onError: () => {
                setUpdatingErrorId(null);
            },
        });
    };

    const handleUpdateAllErrors = () => {
        setIsUpdatingAll(true);
        const items = errors.map((err) => ({
            id: err.id,
            isFixed: true,
        }));
        bulkUpdateReleaseErrors({
            payload: { items },
            onSuccess: () => {
                setIsUpdatingAll(false);
            },
            onError: () => {
                setIsUpdatingAll(false);
            },
        });
    };

    return (
        <li className="space-y-2">
            <SectionTitle
                title={title}
                count={count}
                loading={isFetching}
                color={sectionColor}
                Icon={PackageX}
                action={
                    <Popconfirm
                        title={messages('common.resolveAllErrorsConfirm')}
                        onConfirm={handleUpdateAllErrors}
                        okText={messages('common.confirm')}
                        cancelText={messages('common.cancel')}
                        okButtonProps={{
                            className:
                                'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-none',
                        }}
                        disabled={isPending}
                        placement="bottomRight"
                    >
                        {/* <button
                            disabled={isPending}
                            className="mr-1 flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 text-xs font-semibold text-blue-500 outline-none transition-colors duration-200 hover:text-blue-600 hover:underline disabled:opacity-50 dark:text-blue-400 dark:hover:text-blue-500"
                        >
                            {isUpdatingAll && (
                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                            )}
                            {messages('common.markAllAsResolved')}
                        </button> */}
                        <IconButton disabled={isPending} shape="circle">
                            <CustomTooltip
                                title={messages('common.markAllAsResolved')}
                            >
                                <ListChecks
                                    size={SIZE_ICON}
                                    className="text-blue-500"
                                />
                            </CustomTooltip>
                        </IconButton>
                    </Popconfirm>
                }
            />
            <div className="flex flex-col gap-2">
                {errors.map((err, index) => {
                    const message = getEnrichedErrorMessages(err);
                    const field = err.field || 'unknown';
                    const canLink =
                        !!err.page &&
                        !!err.field &&
                        err.page !== 'unknown' &&
                        err.field !== 'unknown';

                    const isUpdating = isPending && updatingErrorId === err.id;
                    const actionButton = (
                        <CustomTooltip
                            title={messages('common.markAsResolved')}
                        >
                            {isUpdating ? (
                                <div className="flex h-5 w-5 items-center justify-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                                </div>
                            ) : (
                                <Checkbox
                                    checked={false}
                                    disabled={isPending}
                                    onChange={(event) => {
                                        handleUpdateError(event, err.id);
                                    }}
                                    className="transition-transform hover:scale-105"
                                />
                            )}
                        </CustomTooltip>
                    );
                    const alert = (
                        <ErrorAlert
                            label={title}
                            message={message}
                            clickable={canLink}
                            action={actionButton}
                        />
                    );

                    if (!canLink) {
                        return <div key={`enriched-${index}`}>{alert}</div>;
                    }

                    return (
                        <Link
                            key={`enriched-${index}`}
                            href={`${getReleaseTabRoute(releaseId, err.page as RELEASES_TABS)}#${field}`}
                            scroll={false}
                        >
                            {alert}
                        </Link>
                    );
                })}
            </div>
        </li>
    );
}
