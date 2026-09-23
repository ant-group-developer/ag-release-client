import { formattedNumber } from '@/helpers/common';
import { theme, Typography } from 'antd';
import React, { useMemo } from 'react';
import { RELEASES_STATUS } from '../../enums';

export type ReleaseStatusTab =
    | 'all'
    | RELEASES_STATUS.DRAFT
    | RELEASES_STATUS.PROCESSING
    | RELEASES_STATUS.FAILED
    | RELEASES_STATUS.PARTIAL_DONE
    | RELEASES_STATUS.DISTRIBUTED
    | 'needsReview';

type Props = {
    status: ReleaseStatusTab;
    title: string;
    count: number;
    isSelected: boolean;
};

function StatusSegmentItem({ status, title, count, isSelected }: Props) {
    const { token } = theme.useToken();

    const itemConfig = useMemo(() => {
        switch (status) {
            case RELEASES_STATUS.PROCESSING:
                return {
                    dotColor: token.colorInfo,
                    badgeBg: token.colorInfoBg,
                    badgeColor: token.colorInfoText,
                };
            case RELEASES_STATUS.FAILED:
                return {
                    dotColor: token.colorError,
                    badgeBg: token.colorErrorBg,
                    badgeColor: token.colorErrorText,
                };
            case RELEASES_STATUS.PARTIAL_DONE:
                return {
                    dotColor: token.volcano,
                    badgeBg: token.volcano1,
                    badgeColor: token.volcano,
                };
            case 'needsReview':
                return {
                    dotColor: token.colorWarning,
                    badgeBg: token.colorWarningBg,
                    badgeColor: token.colorWarningText,
                };
            case RELEASES_STATUS.DISTRIBUTED:
                return {
                    dotColor: token.colorSuccess,
                    badgeBg: token.colorSuccessBg,
                    badgeColor: token.colorSuccessText,
                };
            case RELEASES_STATUS.DRAFT:
                return {
                    dotColor: undefined,
                    badgeBg: token.colorFillSecondary,
                    badgeColor: token.colorTextSecondary,
                };
            case 'all':
            default:
                return {
                    dotColor: undefined,
                    badgeBg: token.colorFillSecondary,
                    badgeColor: token.colorTextSecondary,
                };
        }
    }, [status, token]);

    return (
        <div className="flex items-center gap-2 px-2 py-1">
            {itemConfig.dotColor && (
                <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: itemConfig.dotColor }}
                />
            )}
            <Typography.Text
                style={{
                    color: token.colorText,
                    fontWeight: 500,
                }}
            >
                {title}
            </Typography.Text>
            <span
                className="inline-flex min-w-[20px] items-center justify-center rounded-md px-1.5 py-0.5 text-xs font-semibold leading-tight"
                style={{
                    backgroundColor:
                        isSelected &&
                        (status === 'all' || status === RELEASES_STATUS.DRAFT)
                            ? token.colorBgContainer
                            : itemConfig.badgeBg,
                    color:
                        isSelected &&
                        (status === 'all' || status === RELEASES_STATUS.DRAFT)
                            ? token.colorText
                            : itemConfig.badgeColor,
                }}
            >
                {formattedNumber(count)}
            </span>
        </div>
    );
}

export default React.memo(StatusSegmentItem);
