'use client';

import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import useModalStore from '@/hooks/use-modal';
import { Link } from '@/i18n/routing';
import { RELEASES_TABS, TYPE_MODAL_RELEASE } from '@/modules/releases/enums';
import { ReleaseValidate } from '@/modules/releases/types';
import { TriangleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ErrorAlert from './error-alert';
import SectionTitle from './section-title';

interface ValidateErrorListProps {
    errors: ReleaseValidate[];
    isFetching: boolean;
    releaseId: string;
    sectionColor: string;
    title: string;
}

const ERROR_ITEM_KEY_PREFIX = 'validate';

export default function ValidateErrorList({
    errors,
    isFetching,
    releaseId,
    sectionColor,
    title,
}: ValidateErrorListProps) {
    const messages = useTranslations();
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const openModal = useModalStore((state) => state.openModal);

    const count = errors.length;
    if (count <= 0) return null;

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
                return `${safeMessage(`formFields.${field}`)}`;

            default:
                return safeMessage(`formFields.${field}`);
        }
    };

    const getErrorMessages = (error: ReleaseValidate) => {
        return messages(error.messageCode as any);
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

    return (
        <li className="space-y-2">
            <SectionTitle
                title={title}
                count={count}
                loading={isFetching}
                color={sectionColor}
                Icon={TriangleAlert}
            />
            <div className="flex flex-col gap-2">
                {errors.map((err, index) => {
                    const label = getFieldLabel(err.field, err.page);

                    return (
                        <Link
                            key={`${ERROR_ITEM_KEY_PREFIX}-${index}`}
                            href={`${getReleaseTabRoute(releaseId, err.page as RELEASES_TABS)}#${err.field}${err?.trackId ? `.${err.trackId}` : ''}`}
                            scroll={false}
                            onClick={() => {
                                handleClickError(err);
                            }}
                        >
                            <ErrorAlert
                                label={label ?? ''}
                                message={getErrorMessages(err)}
                            />
                        </Link>
                    );
                })}
            </div>
        </li>
    );
}
