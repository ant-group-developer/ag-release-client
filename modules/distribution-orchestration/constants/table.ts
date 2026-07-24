/**
 * Field-order keys cho GET /distributions (khớp FieldOrderRelease server).
 * Server sort qua fieldOrder + orderBy (tái dùng ReleaseService.getList).
 */
export const DISTRIBUTION_SORT_FIELD = {
    DSPS_LIVE: 'dsps_live',
    TRACKS_COUNT: 'tracks_count',
    TOTAL_DURATION: 'total_duration',
    RELEASE_DATE: 'releaseDate',
    UPDATED_AT: 'updatedAt',
} as const;
