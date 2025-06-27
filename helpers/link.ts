import {
    FALLBACK_IMAGE,
    FALLBACK_SOURCE,
    FALLBACK_VIDEO,
    ICON_IMAGE,
    ICON_SOURCE,
    ICON_VIDEO,
} from '@/constants/common';
import { UPLOAD_TYPE } from '@/enums/common';
import { RELEASES_TABS } from '@/modules/releases/enums';

export const getLinkDrive = (fileId: string) =>
    `https://drive.google.com/uc?export=view&id=${fileId}`;

export const getLinkDrivePreview = (fileId: string) =>
    `https://drive.google.com/file/d/${fileId}/preview`;

export const getLinkDriveImage = (fileId: string, width?: number): string => {
    if (!fileId) return '';

    const baseUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    const authParam = '?authuser=0';

    // Check that width is defined, is not NaN, and is non-negative.
    const isValidWidth =
        width !== undefined && !Number.isNaN(width) && width > 0;
    const widthSegment = isValidWidth ? `=w${width}` : '';

    return `${baseUrl}${widthSegment}${authParam}`;
};

export const getLinkDriveImageV2 = (
    fileId: string,
    height?: number
): string => {
    if (!fileId) return '';

    const baseUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    const authParam = '?authuser=0';

    // Tạo mảng các tham số hợp lệ
    const params = [];

    // Check that height is defined, is not NaN, and is non-negative.
    if (height !== undefined && !Number.isNaN(height) && height > 0) {
        params.push(`${height}`);
    }

    // if (height !== undefined && !Number.isNaN(height) && height > 0) {
    //     params.push(`h${height}`);
    // }

    // Kết hợp các tham số với dấu '-'
    const sizeParams = params.length > 0 ? `=h${params.join('-')}` : '';

    return `${baseUrl}${sizeParams}${authParam}`;
};

export const getLinkDriveDownload = (fileId: string) =>
    `https://drive.google.com/uc?export=download&id=${fileId}`;

export const getFallbackUrl = (type: string) => {
    const fallbacks: Record<string, string> = {
        [UPLOAD_TYPE.IMAGE]: FALLBACK_IMAGE,
        [UPLOAD_TYPE.VIDEO]: FALLBACK_VIDEO,
        [UPLOAD_TYPE.THUMB_VIDEO]: FALLBACK_VIDEO,
        [UPLOAD_TYPE.SOURCE]: FALLBACK_SOURCE,
    };
    return fallbacks[type] || FALLBACK_IMAGE;
};

export const getIconByType = (type: string) => {
    const icons: Record<string, string> = {
        [UPLOAD_TYPE.IMAGE]: ICON_IMAGE,
        [UPLOAD_TYPE.VIDEO]: ICON_VIDEO,
        [UPLOAD_TYPE.SOURCE]: ICON_SOURCE,
    };
    return icons[type] || ICON_IMAGE;
};

export const getReleaseDetailTabRoute = (
    releaseId: string,
    tab: RELEASES_TABS
) => `/releases/detail/${releaseId}/${tab}`;
