import {
    DATE_FORMAT,
    LOCALE,
    ORDER,
    ORIENTATION,
    UPLOAD_TYPE,
} from '@/enums/common';
import { presetPalettes } from '@ant-design/colors';
import { DatePickerProps, GetProp, UploadProps } from 'antd';
import clsx, { ClassValue } from 'clsx';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { parseBlob } from 'music-metadata';
import { twMerge } from 'tailwind-merge';
import { getIntlCodeByReleaseStatus } from './intl';
dayjs.extend(utc);
/**
 * Extracts media metadata from a file in the browser (Client-Side)
 * @param file - The File object from an `<input type="file">`
 * @returns Promise with metadata
 */

export const getImageDimensions = (
    file: File
): Promise<{
    width: number;
    height: number;
    orientation: ORIENTATION;
}> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            const orientation =
                width > height ? ORIENTATION.HORIZONTAL : ORIENTATION.VERTICAL;

            resolve({
                width,
                height,
                orientation,
            });
        };
        img.onerror = reject;

        // Create a blob URL to load the image
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;
    });
};
export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00:00'; // Handle invalid input

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function formattedDate(
    date?: string | number | Date | dayjs.Dayjs | null | undefined,
    format?: DATE_FORMAT | string
): string {
    return (
        (date && dayjs(date).format(format ?? DATE_FORMAT.DATE_MINUTE)) || ''
    );
}

export function getIndex(
    pageSize: number | undefined = 0,
    currentPage: number | undefined = 1,
    index: number
) {
    return pageSize * (currentPage - 1) + index + 1;
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formattedNumber(
    value: number | string | null | undefined,
    lang: LOCALE = LOCALE.EN,
    collapse: boolean = false
) {
    const localeArg = lang === LOCALE.VI ? 'en-US' : 'en-US';
    // const localeArg = lang === LOCALE.VI ? 'vi-VN' : 'en-US';
    const number = value ? Number(value) : 0;
    const option: Intl.NumberFormatOptions | undefined = {
        notation: collapse ? 'compact' : undefined,
        maximumFractionDigits: 2,
    };
    return new Intl.NumberFormat(localeArg, option).format(number);
}

export function replaceSpecialChars(str: string) {
    const regex = /[\\.{ }^%`[\]"<>#|~/]/g;
    return str.replace(regex, '_');
}

export function parseTimestampToDateTime(timestamp: number) {
    // Create a new Date object using the timestamp (converted to milliseconds)
    const date = new Date(timestamp * 1000);

    // Format the date and time in a human-readable format
    // You can adjust the format as needed
    const formattedDateTime = date.toISOString();

    return formattedDateTime;
}

export function stringToNumber(value: any) {
    if (!value) return undefined;
    return Number(value);
}

export function getAvatarPlaceholder(value: any) {
    return value?.[0]?.toUpperCase();
}

export const convertSecondsToTime = (duration = 0) => {
    if (isNaN(Number(duration)) || duration < 0) {
        return '00:00';
    }

    let minutes: string | number = Math.floor(duration / 60);
    let seconds: string | number = Math.floor(duration - minutes * 60);

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    if (seconds < 10) {
        seconds = `0${seconds}`;
    }

    return `${minutes}:${seconds}`;
};

export const convertMsToMinSec = (ms: number | undefined): string => {
    if (!Number.isFinite(ms) || !ms) return '00:00';
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const getFileName = (file: File) => {
    return file.name.split('.').slice(0, -1).join('.');
};

export const getFileExtension = (file: File) => {
    return file.name.split('.').pop();
};

export const getFileDuration = async (file: File) => {
    const audioContext = new AudioContext();
    const buffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(buffer);
    const duration = audioBuffer.duration;
    return Math.ceil(duration);
};

export const flattenData = (data: any[], parentObj: any) => {
    const result: any[] = [];

    data.forEach((obj) => {
        const item = { ...obj, parentObj };
        result.push(item);

        if (obj.children?.length > 0) {
            result.push(...flattenData(obj.children, item));
        }
    });

    return result;
};

export const convertParams = (value: any) => {
    if (typeof value !== 'object') return value;

    try {
        return value.join(',');
    } catch {
        return undefined;
    }
};

export const isNullOrUndefined = (value: any) =>
    value === undefined || value === null;

export function getSortOrder<T>(
    value: ORDER | undefined,
    key: T,
    target: string
) {
    if (key !== target) return null;
    if (value === 'ASC') return 'ascend';
    if (value === 'DESC') return 'descend';
    return null;
}

export const setSortOrder = (sort: any, defaultValue?: ORDER) => {
    const order =
        (sort.order === 'ascend' && ORDER.ASC) ||
        (sort.order === 'descend' && ORDER.DESC) ||
        defaultValue;

    return order;
};

export const disabledDateTomorrow: DatePickerProps['disabledDate'] = (
    current
) => {
    // Can not select days before today and today
    return current && current > dayjs().startOf('day').add(1, 'day');
};

export const compareObjects = (obj1: any, obj2: any) => {
    // const customize = (objValue: any, othValue: any) => {
    //     if (objValue == othValue) {
    //         return true;
    //     }
    // };

    // return _.isEqualWith(obj1, obj2, customize);

    const keysA = Object.keys(obj1);
    const keysB = Object.keys(obj2);

    // Kiểm tra nếu số lượng keys không bằng nhau
    if (keysA.length !== keysB.length) {
        return false;
    }

    // Kiểm tra nếu tất cả keys trong object A có trong object B và ngược lại
    for (const key of keysA) {
        if (!keysB.includes(key)) {
            return false;
        }
    }

    // So sánh giá trị của từng key, chuyển đổi kiểu dữ liệu nếu cần
    for (const key of keysA) {
        if (String(obj1[key]) !== String(obj2[key])) {
            return false;
        }
    }

    return true;
};

export const calculatePercent = (
    value1: string | number,
    value2: string | number
) => {
    const number1 = Number(value1);
    const number2 = Number(value2);
    if (number2 === 0) return 0;
    const percentage = (number1 / number2) * 100;
    return Math.round(percentage * 100) / 100; // Làm tròn đến 2 chữ số thập phân
};

export const calculateComparePercent = (current: number, previous: number) => {
    if (previous === 0 && current === 0) {
        return 0;
    }
    if (previous === 0) {
        return 100;
    }
    if (current === 0) {
        return -100;
    }
    const pct = ((current - previous) / previous) * 100;
    return Math.round(pct);
};

export function formatFileSize(bytes: number) {
    const mb = bytes / (1024 * 1024);
    return `${parseFloat(mb.toFixed(2))} MB`;
}

export const getColorByUploadType = (value: string) => {
    const defaultColor = 'blue';
    const colorSets: Record<string, string> = {
        [UPLOAD_TYPE.IMAGE]: 'lime',
        [UPLOAD_TYPE.VIDEO]: 'purple',
        [UPLOAD_TYPE.SOURCE]: 'orange',
    };
    return colorSets[value] || defaultColor;
};

type OrderUploadMessageKey =
    | 'common.image'
    | 'common.video'
    | 'common.videoAndImage'
    | 'common.source'
    | 'common.mp3';

export const getIntlCodeByTypeUpload = (
    value: UPLOAD_TYPE
): OrderUploadMessageKey => {
    const uploadTypeToMessageMap: Record<UPLOAD_TYPE, OrderUploadMessageKey> = {
        [UPLOAD_TYPE.IMAGE]: 'common.image',
        [UPLOAD_TYPE.VIDEO]: 'common.video',
        [UPLOAD_TYPE.THUMB_VIDEO]: 'common.videoAndImage',
        [UPLOAD_TYPE.SOURCE]: 'common.source',
        [UPLOAD_TYPE.MP3]: 'common.mp3',
    };

    return uploadTypeToMessageMap[value] || 'common.image';
};

export function formatDatesToUTC(
    startDate: dayjs.ConfigType,
    endDate: dayjs.ConfigType
): [string, string] {
    // const startDateFormatted = dayjs(startDate).startOf('day').toISOString();
    // const endDateFormatted = dayjs(endDate).endOf('day').toISOString();
    const startDateFormatted = dayjs(startDate).startOf('day').toISOString();
    // .format(DATE_FORMAT.YEAR_MONTH_DAY_TIME);
    const endDateFormatted = dayjs(endDate).endOf('day').toISOString();
    // .format(DATE_FORMAT.YEAR_MONTH_DAY_TIME);
    return [startDateFormatted, endDateFormatted];
}

export const isValidUrl = (urlString: string) => {
    try {
        new URL(urlString);
        return true;
    } catch (e) {
        return false;
    }
};

export const ExportFileExcel = (
    excelBlob: Blob | undefined,
    defaultNameDownload?: string
) => {
    if (!excelBlob) {
        console.error('No Excel data available to export');
        return;
    }

    // Tạo URL từ blob
    const url = window.URL.createObjectURL(excelBlob);

    // Tạo một thẻ a ẩn để trigger download
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;

    // Đặt tên file (có thể thêm ngày tháng cho dễ phân biệt)
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    a.download = `${defaultNameDownload ?? formattedDate}`;

    // Thêm vào DOM và click
    document.body.appendChild(a);
    a.click();

    // Dọn dẹp
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
};

export const hexToRGBA = (hex: string, alpha: number) => {
    let r: number = 0,
        g: number = 0,
        b: number = 0;

    // 3 digits =>  #RGB
    if (hex?.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits => #RRGGBB
    else if (hex?.length === 7) {
        r = parseInt(hex[1] + hex[2], 16);
        g = parseInt(hex[3] + hex[4], 16);
        b = parseInt(hex[5] + hex[6], 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const rgbaToHex = (r: number, g: number, b: number, a: number = 1) => {
    // Chuyển các giá trị thành chuỗi hex và đảm bảo chúng có 2 chữ số
    const toHex = (value: number) => {
        const hex = Math.round(value).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };

    // Nếu alpha = 1 (không trong suốt), trả về hex RGB
    if (a === 1) {
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Nếu có độ trong suốt, trả về hex RGBA
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(Math.round(a * 255))}`;
};

export const genPreset = (preset = presetPalettes) => {
    return Object.entries(preset).map(([label, colors]) => ({
        label,
        colors: colors.slice(2),
        key: label,
    }));
};

export const getTitleChipDisplay = (
    dataFilterType: string | undefined,
    messages: any
) => {
    if (!dataFilterType) return '';
    const MAX_CHIP_DISPLAY = 2;
    const dataFilterValue = dataFilterType.split(',');

    const translateDataFilterValue = dataFilterValue.map((item) =>
        messages(getIntlCodeByReleaseStatus(item))
    );

    if (translateDataFilterValue.length <= MAX_CHIP_DISPLAY)
        return translateDataFilterValue.join(',');

    const displayDataFilter = translateDataFilterValue
        .slice(0, MAX_CHIP_DISPLAY)
        .join(',');
    const remainingDataFilter =
        translateDataFilterValue.length - MAX_CHIP_DISPLAY;
    return `${displayDataFilter} ...+${remainingDataFilter} ${messages('common.other')}`;
};

export const convertSecondsToHoursMinutes = (seconds: number) => {
    if (isNaN(Number(seconds)) || seconds < 0) {
        return '00:00:00';
    }
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

export const convertSecondsToHHMMSS = (seconds: number) => {
    if (isNaN(Number(seconds)) || seconds < 0) {
        return '00:00:00';
    }
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
};

export function parsePeakData(data = '') {
    return data.split(';');
}

export function convertPeakData(data = []) {
    return data.join(';');
}

export const getPeakData = async (audioFile: any) => {
    try {
        const audioContext = new AudioContext();
        const buffer = await audioFile.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(buffer);
        const channelData = audioBuffer.getChannelData(0);
        const peaks = [];
        const step = Math.ceil(channelData.length / 1024);
        for (let i = 0; i < channelData.length; i += step) {
            let max = 0;
            for (let j = 0; j < step; j++) {
                const val = Math.abs(channelData[i + j]);
                if (val > max) {
                    max = val;
                }
            }
            peaks.push(max);
        }
        const duration = audioBuffer.duration;
        return { peakData: peaks, songDuration: duration };
    } catch {
        return { peakData: [], songDuration: 0 };
    }
};

export interface AudioMetadata {
    codec: string;
    format: string;
    bitrate: number;
    sampleRate: number;
    channels: number;
    duration: number;
    bitDepth: number;
    mqs: string;
}

const extractAudioMetadata = async (file: File): Promise<AudioMetadata> => {
    try {
        const metadata = await parseBlob(file); // Phân tích file âm thanh từ Blob
        if (!metadata.format) {
            throw new Error('No metadata found');
        }
        const audioInfo: AudioMetadata = {
            codec: metadata.format.codec ?? 'unknown', // Định dạng codec (WAV, MP3, v.v.)
            format: metadata.format.container ?? 'unknown', // Định dạng container (WAV, MP3, v.v.)
            bitrate: metadata.format.bitrate ?? 0, // Bitrate của file âm thanh
            sampleRate: metadata.format.sampleRate ?? 0, // Tần số mẫu (Sample Rate)
            channels: metadata.format.numberOfChannels ?? 0, // Số kênh (Mono/Stereo)
            duration: Math.round(metadata.format.duration ?? 0), // Thời gian của bài hát (tính bằng giây)
            bitDepth: metadata.format.bitsPerSample ?? 0, // Bit Depth (nếu có)
            mqs:
                (metadata?.format?.sampleRate ?? 0) >= 96000 &&
                (metadata?.format?.bitrate ?? 0) >= 320000
                    ? 'Yes'
                    : 'No', // MQS (Ước tính dựa trên sample rate và bitrate)
        };

        return audioInfo;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error extracting metadata:', error.message);
        } else {
            console.error(
                'An unknown error occurred during metadata extraction'
            );
        }
        throw error; // Đẩy lỗi ra nếu có vấn đề trong quá trình phân tích
    }
};

export default extractAudioMetadata;

// type ReleaseTypeMessageKey = 'common.album' | 'common.single' | 'common.ep';
// export const getIntlCodeByReleaseType = (
//     value: string
// ): ReleaseTypeMessageKey => {
//     const releaseTypeToMessageMap: Record<string, ReleaseTypeMessageKey> = {
//         [RELEASES_TYPE.ALBUM]: 'common.album',
//         [RELEASES_TYPE.SINGLE]: 'common.single',
//         [RELEASES_TYPE.EP]: 'common.ep',
//     };
//     return releaseTypeToMessageMap[value] || 'common.album';
// };

export const timeStringToSeconds = (time: string) => {
    if (!time) return 0;
    const [h = '0', m = '0', s = '0'] = time.split(':');
    const result = Number(h) * 3600 + Number(m) * 60 + Number(s);
    return result;
};

export function getLanguageLabel(code: string) {
    const languageMap: Record<string, string> = {
        vi: 'Tiếng Việt',
        en: 'English',
    };
    return languageMap[code] || code;
}

// Chuyển số giây sang chuỗi HH:mm
export const secondsToHHmm = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Chuyển chuỗi HH:mm sang số giây
export const hhmmToSeconds = (hhmm: string) => {
    if (!hhmm) return 0;
    const [h, m] = hhmm.split(':').map(Number);
    return h * 3600 + m * 60;
};

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const formatCurrency = (price: number, currency?: string) => {
    if (!currency || currency.length !== 3) {
        return price.toString();
    }

    try {
        return new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency,
        }).format(price);
    } catch {
        return price.toString();
    }
};
