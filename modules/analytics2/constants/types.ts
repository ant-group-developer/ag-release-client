import dayjs from 'dayjs';

export const ANALYTICS_RANKING_THUMBNAIL_SIZE = 32;
export const RANK_COLUMN_WIDTH = 120;

export const ANALYTICS_DEFAULT_START_DATE = dayjs()
    .subtract(6, 'month')
    .startOf('month')
    .format('YYYY-MM-DD');

export const ANALYTICS_DEFAULT_END_DATE = dayjs()
    .endOf('month')
    .format('YYYY-MM-DD');
