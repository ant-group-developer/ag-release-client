import { parseAsInteger, parseAsJson, parseAsString } from 'nuqs';
import { RELEASES_COLUMNS_DISPLAY } from '../enums';
import { ReleasesDataFilter } from '../types';

export const defaultVisibleColumnsReleases = [
    // RELEASES_COLUMNS_DISPLAY.I_NO,
    RELEASES_COLUMNS_DISPLAY.THUMBNAIL,
    RELEASES_COLUMNS_DISPLAY.TITLE,
    RELEASES_COLUMNS_DISPLAY.ARTIST,
    RELEASES_COLUMNS_DISPLAY.PUBLISHER,
    // RELEASES_COLUMNS_DISPLAY.RELEASE_ID,
    // RELEASES_COLUMNS_DISPLAY.TYPE,
    RELEASES_COLUMNS_DISPLAY.UPC,
    RELEASES_COLUMNS_DISPLAY.STATUS,
    RELEASES_COLUMNS_DISPLAY.TRACK_COUNT,
    // RELEASES_COLUMNS_DISPLAY.DURATION,
    RELEASES_COLUMNS_DISPLAY.RELEASE_DATE,
    // RELEASES_COLUMNS_DISPLAY.CREATED_AT,
    // RELEASES_COLUMNS_DISPLAY.UPDATED_AT,
    RELEASES_COLUMNS_DISPLAY.ACTIONS,
];

export const RELEASE_COVER_ART_SIZE = {
    S75: '75x75',
    S100: '100x100',
    S160: '160x160',
    S300: '300x300',
    S900: '900x900',
    ORIGINAL: 'original',
} as const;

export const releasesFilterParsers = {
    status: parseAsString,
    startDateRelease: parseAsString,
    endDateRelease: parseAsString,
    primaryGenreId: parseAsString,
    artistId: parseAsString,
    labelId: parseAsString,
    albumFormatId: parseAsString,
    releaseId: parseAsString,
    isVariousArtist: parseAsString,
    idInclude: parseAsString,
    needsReview: parseAsString,
    hasError: parseAsString,
    channelId: parseAsString,
    isrc: parseAsString,
    genres: parseAsString,
    ciDataStatus: parseAsString,
    neverExported: parseAsString,
    lastImportIsFailed: parseAsString,
    needImportAgain: parseAsString,
    hasQaFlag: parseAsString,
    tenantIds: parseAsString,
    startCreatedAt: parseAsString,
    endCreatedAt: parseAsString,
    startUpdatedAt: parseAsString,
    endUpdatedAt: parseAsString,
    keyword: parseAsString,
    hangingExecutionDays: parseAsInteger,

    dspDelivery: parseAsJson<NonNullable<ReleasesDataFilter['dspDelivery']>>(
        (value) => {
            if (value && typeof value === 'object') {
                return value as NonNullable<ReleasesDataFilter['dspDelivery']>;
            }

            return {};
        }
    ),
};
