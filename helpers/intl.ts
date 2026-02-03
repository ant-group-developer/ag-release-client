import { DISTRIBUTION_STATUS } from '@/modules/distribution/enum';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { STATUS_BACKUP } from '@/modules/setting/enums';
import { GENRES, SCAN_COPYRIGHT_STATUS } from '@/modules/tracks/enums';

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

type ReleaseStatusMessageKey =
    | 'common.processing'
    | 'common.issues'
    | 'common.neverDistributed'
    | 'common.distributed'
    | 'common.takenDown'
    | 'common.draft';
export const getIntlCodeByReleaseStatus = (
    value: string
): ReleaseStatusMessageKey => {
    const releaseStatusToMessageMap: Record<string, ReleaseStatusMessageKey> = {
        [RELEASES_STATUS.PROCESSING]: 'common.processing',
        [RELEASES_STATUS.ISSUES]: 'common.issues',
        [RELEASES_STATUS.NEVER_DISTRIBUTED]: 'common.neverDistributed',
        [RELEASES_STATUS.DISTRIBUTED]: 'common.distributed',
        [RELEASES_STATUS.TAKEN_DOWN]: 'common.takenDown',
        [RELEASES_STATUS.DRAFT]: 'common.draft',
    };
    return releaseStatusToMessageMap[value] || 'common.processing';
};

type BackupStatusMessageKey =
    | 'track.status.running'
    | 'track.status.finished'
    | 'track.status.failed';

export const getIntlCodeByBackupStatus = (
    value: string
): BackupStatusMessageKey => {
    const releaseStatusToMessageMap: Record<string, BackupStatusMessageKey> = {
        [STATUS_BACKUP.RUNNING]: 'track.status.running',
        [STATUS_BACKUP.SUCCESS]: 'track.status.finished',
        [STATUS_BACKUP.FAILED]: 'track.status.failed',
    };
    return releaseStatusToMessageMap[value] || 'common.unknown';
};

type GenresMessageKey =
    | 'genres.pop'
    | 'genres.rock'
    | 'genres.jazz'
    | 'genres.country'
    | 'genres.hipHop'
    | 'genres.rB'
    | 'genres.electronic'
    | 'genres.reggae'
    | 'genres.rap'
    | 'genres.blues'
    | 'genres.classical';
export const getIntlCodeByGenres = (value: string): GenresMessageKey => {
    const genresToMessageMap: Record<string, GenresMessageKey> = {
        [GENRES.POP]: 'genres.pop',
        [GENRES.ROCK]: 'genres.rock',
        [GENRES.JAZZ]: 'genres.jazz',
        [GENRES.COUNTRY]: 'genres.country',
        [GENRES.HIP_HOP]: 'genres.hipHop',
        [GENRES.R_B]: 'genres.rB',
        [GENRES.ELECTRONIC]: 'genres.electronic',
        [GENRES.REGGAE]: 'genres.reggae',
        [GENRES.BLUES]: 'genres.blues',
        [GENRES.CLASSICAL]: 'genres.classical',
        [GENRES.RAP]: 'genres.rap',
    };
    return genresToMessageMap[value] || 'common.pop';
};

export const getIntlCodeByScanCopyrightStatus = (
    status: SCAN_COPYRIGHT_STATUS
) => {
    const scanStatusMap = {
        [SCAN_COPYRIGHT_STATUS.FINISHED]: 'scanStatus.finished',
        [SCAN_COPYRIGHT_STATUS.REJECTED]: 'scanStatus.rejected',
        [SCAN_COPYRIGHT_STATUS.UN_SCANNED]: 'scanStatus.unScanned',
        [SCAN_COPYRIGHT_STATUS.WARNING]: 'scanStatus.warning',
    };
    return scanStatusMap[status] || 'common.notAvailable';
};
