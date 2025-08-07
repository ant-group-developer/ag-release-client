import { DATE_FORMAT } from '@/enums/common';
import { ListResponse, PaginationResponse } from '@/types/api';
import { FormProps } from 'antd';
import dayjs from 'dayjs';

export const COOKIES_KEY = {
    TOKEN: 'at',
    REFRESH_TOKEN: 'rt',
    LOCALE: 'locale',
};

export const MAX_FILE_RENDER = 1000;

export const FORM_LAYOUT: FormProps = {
    labelCol: {
        xs: 9,
        md: 8,
        lg: 7,
        xl: 6,
    },
    wrapperCol: {
        xs: 15,
        md: 16,
        lg: 17,
        xl: 18,
    },
    colon: false,
    labelAlign: 'left',
};

export const FORM_LAYOUT_VERTICAL: FormProps = {
    labelCol: {
        xs: 24,
        md: 24,
        lg: 24,
    },
    wrapperCol: {
        xs: 24,
        md: 24,
        lg: 24,
    },
    colon: false,
    labelAlign: 'left',
};

export const ONE_DAY = 60 * 60 * 24;

export const LINE_SPREAD = '\n';

export const DOLLAR_SIGN = '$';

export const defaultData: ListResponse = {
    data: [],
    total: 0,
};

export const DEFAULT_DATA_PAGINATION: PaginationResponse['data'] = {
    items: [],
    metadata: {
        currentPage: 0,
        limit: 0,
        totalItems: 0,
        totalPages: 0,
    },
};

export const SIZE_ICON_SMALL = 16;
export const SIZE_ICON = 18;
export const SIZE_ICON_BIG = 22;
export const SIZE_ICON_BUTTON = 14;

export const defaultDate = {
    // startDate: dayjs().subtract(14, 'day').format(DATE_FORMAT.MYSQL_TYPE_DATE),
    // endDate: dayjs().add(14, 'day').format(DATE_FORMAT.MYSQL_TYPE_DATE),
    startDate: dayjs().startOf('day').format(DATE_FORMAT.MYSQL_TYPE_DATE),
    endDate: dayjs().endOf('day').format(DATE_FORMAT.MYSQL_TYPE_DATE),
};
export const FALLBACK_VIDEO = '/image/fallback-video.png';
export const FALLBACK_IMAGE = '/image/fallback-image.png';
export const FALLBACK_SOURCE = '/image/fallback-folder.png';

export const FALLBACK_IMAGE_HORIZONTAL = '/image/fallback-image-horizontal.png';
export const FALLBACK_VIDEO_HORIZONTAL = '/image/fallback-video-horizontal.png';

export const FALLBACK_VIDEO_SMALL = '/image/fallback-video-small.png';
export const FALLBACK_IMAGE_SMALL = '/image/fallback-image-small.png';

export const ICON_VIDEO = '/icon/video-drive.svg';
export const ICON_IMAGE = '/icon/image-drive.svg';
export const ICON_SOURCE = '/icon/source-drive.svg';

export const OPACITY_TAG = 0.1;

export const PAGE_SIZE_OPTIONS = [21, 28, 32];

export const ARRAY_SEPARATOR = ',';
