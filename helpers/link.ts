import {
    FALLBACK_IMAGE,
    FALLBACK_SOURCE,
    FALLBACK_VIDEO,
    ICON_IMAGE,
    ICON_SOURCE,
    ICON_VIDEO,
} from '@/constants/common';
import { UPLOAD_TYPE } from '@/enums/common';
import { ARTIST_DETAIL_TABS } from '@/modules/artist/enum';
import { LABEL_DETAIL_TABS } from '@/modules/labels/enum';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { TRACK_TABS } from '@/modules/tracks/enums';

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

export enum RELEASE_DETAIL_ACTION {
    EDIT = 'edit',
    READ = 'read',
}
export const getReleaseDetailTabRoute = (
    releaseId: string,
    tab: RELEASES_TABS,
    action?: RELEASE_DETAIL_ACTION
) => `/releases/detail/${releaseId}/${tab}${action ? `?action=${action}` : ''}`;

export const getTrackDetailRoute = (trackId: string, tab: TRACK_TABS) =>
    `/tracks/detail/${trackId}/${tab}`;

export const getArtistDetailRoute = (
    artistId: string,
    tab: ARTIST_DETAIL_TABS
) => `/artists/detail/${artistId}/${tab}`;

export const getLabelDetailRoute = (labelId: string, tab: LABEL_DETAIL_TABS) =>
    `/labels/detail/${labelId}/${tab}`;

export const getAvatarUrl = (
    name: string,
    size = 128,
    bgColor?: string,
    textColor = 'fff'
) => {
    const DARK_BG_COLORS = [
        '42a5f5', // Medium Blue
        'ffd600', // Vivid Yellow
        'ffb300', // Amber/Gold
        '66bb6a', // Medium Green
        'ec407a', // Medium Pink
        'ab47bc', // Medium Purple
        'ffee58', // Lemon Yellow
        '29b6f6', // Sky Blue
        '9ccc65', // Leaf Green
        'ff7043', // Coral/Orange
    ];

    function getRandomDarkColor() {
        const index = Math.floor(Math.random() * DARK_BG_COLORS.length);
        return DARK_BG_COLORS[index];
    }

    // Nếu bgColor không truyền hoặc là 'random', sẽ random màu tối
    const background =
        !bgColor || bgColor === 'random' ? getRandomDarkColor() : bgColor;

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
    )}&background=${background}&color=${textColor}&size=${size}&bold=true&length=2`;
};

// export const getGravatarUrl = (email: string, size = 128, name?: string) => {
//     const hash = md5(email.trim().toLowerCase());
//     let url = `https://www.gravatar.com/avatar/${hash}?s=${size}&d=initials&color=fff&background=999999`;

//     if (name) {
//         url += `&name=${encodeURIComponent(name)}`;
//     }
//     return url;
// };
