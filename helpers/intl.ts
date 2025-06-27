import { DISTRIBUTION_STATUS } from '@/modules/distribution/enum';

type DistributionStatusMessageKey =
    | 'common.processing'
    | 'common.issues'
    | 'common.distributed'
    | 'common.takenDown'
    | 'common.neverDistributed'
    | 'common.all';
export const getIntlCodeByDistributionStatus = (
    status: DISTRIBUTION_STATUS
) => {
    const distributionStatusToMessageMap: Record<
        DISTRIBUTION_STATUS,
        DistributionStatusMessageKey
    > = {
        [DISTRIBUTION_STATUS.PROGRESS]: 'common.processing',
        [DISTRIBUTION_STATUS.ISSUE]: 'common.issues',
        [DISTRIBUTION_STATUS.DISTRIBUTED]: 'common.distributed',
        [DISTRIBUTION_STATUS.TAKE_DOWN]: 'common.takenDown',
        [DISTRIBUTION_STATUS.NEVER_DISTRIBUTED]: 'common.neverDistributed',
        [DISTRIBUTION_STATUS.ALL]: 'common.all',
    };

    return distributionStatusToMessageMap[status] || 'common.progress';
};
