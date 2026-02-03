import { LINE_SPREAD } from '@/constants/common';
import { LOCALE } from '@/enums/common';
import { uniq } from 'lodash';

export function toNonAccentVietnamese(str = '') {
    str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/Đ/g, 'D');
    str = str.replace(/đ/g, 'd');
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
    return str;
}

export const checkPlural = (value: number, locale: LOCALE) =>
    value > 1 && locale === LOCALE.EN ? 's' : '';

function readGroup(group: any) {
    const readDigit = [
        ' Không',
        ' Một',
        ' Hai',
        ' Ba',
        ' Bốn',
        ' Năm',
        ' Sáu',
        ' Bảy',
        ' Tám',
        ' Chín',
    ];
    let temp = '';
    if (group == '000') return '';
    temp = readDigit[parseInt(group.substring(0, 1))] + ' Trăm';
    if (group.substring(1, 2) == '0')
        if (group.substring(2, 3) == '0') return temp;
        else {
            temp += ' Lẻ' + readDigit[parseInt(group.substring(2, 3))];
            return temp;
        }
    else temp += readDigit[parseInt(group.substring(1, 2))] + ' Mươi';
    if (group.substring(2, 3) == '5') temp += ' Lăm';
    else if (group.substring(2, 3) != '0')
        temp += readDigit[parseInt(group.substring(2, 3))];
    return temp;
}

export function readMoneyVietnamese(number: any) {
    if (number == null || number == undefined || isNaN(number)) return '';
    let num = number.toString();
    let temp = '';
    while (num.length < 18) {
        num = '0' + num;
    }
    const g1 = num.substring(0, 3);
    const g2 = num.substring(3, 6);
    const g3 = num.substring(6, 9);
    const g4 = num.substring(9, 12);
    const g5 = num.substring(12, 15);
    const g6 = num.substring(15, 18);
    if (g1 != '000') {
        temp = readGroup(g1);
        temp += ' Triệu';
    }
    if (g2 != '000') {
        temp += readGroup(g2);
        temp += ' Nghìn';
    }
    if (g3 != '000') {
        temp += readGroup(g3);
        temp += ' Tỷ';
    } else if ('' != temp) {
        temp += ' Tỷ';
    }
    if (g4 != '000') {
        temp += readGroup(g4);
        temp += ' Triệu';
    }
    if (g5 != '000') {
        temp += readGroup(g5);
        temp += ' Nghìn';
    }
    temp = temp + readGroup(g6);
    temp = temp.replaceAll('Một Mươi', 'Mười');
    temp = temp.trim();
    temp = temp.replaceAll('Không Trăm', '');
    temp = temp.trim();
    temp = temp.replaceAll('Mười Không', 'Mười');
    temp = temp.trim();
    temp = temp.replaceAll('Mươi Không', 'Mươi');
    temp = temp.trim();
    if (temp.indexOf('Lẻ') == 0) temp = temp.substring(2);
    temp = temp.trim();
    temp = temp.replaceAll('Mươi Một', 'Mươi Mốt');
    temp = temp.trim();
    const result =
        temp.substring(0, 1).toUpperCase() + temp.substring(1).toLowerCase();
    return result == '' ? 'Không' : result;
    // return (result == '' ? 'Không' : result) + ' đồng chẵn';
}

export function upperCaseFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getValueFromTextArea = (value: string, unique?: boolean) => {
    if (!value) return [];

    const data = value
        .split(LINE_SPREAD)
        .map((item) => item.trim())
        .filter((item) => item);

    if (unique) {
        return uniq(data);
    }

    return data;
};

export const convertToTextAreaValue = (value: any) => {
    if (!value) return null;

    return value.join(LINE_SPREAD);
};

export const isValidJSON = (str: any) => {
    try {
        JSON.parse(str);
    } catch {
        return false;
    }
    return true;
};

export const getLastName = (fullname: string) => {
    if (!fullname) return;
    const names = fullname?.trim().split(' ');
    return names[names?.length - 1];
};

export const getNameByLocale = (
    nameEn: string,
    nameVi: string,
    locale: string
) => {
    if (!nameEn || !nameVi) return nameEn || nameVi;
    return locale === LOCALE.VI ? nameVi : nameEn;
};

export const getCodeFormatted = (code: string) => {
    return code
        .trim()
        .split(' ')
        .map((i) => i.toUpperCase())
        .join('_');
};

// Không dùng nữa
// export function genFolderBucket({
//     uploadPurpose,
//     releaseId,
//     fileName,
// }: {
//     uploadPurpose: TYPE_UPLOAD_BUCKET;
//     releaseId: string;
//     fileName?: string;
// }) {
//     const datePrefix = dayjs().utc().format('YYYY_MM_DD');

//     let subFolder = '';
//     switch (uploadPurpose) {
//         case TYPE_UPLOAD_BUCKET.TRACK:
//         case TYPE_UPLOAD_BUCKET.JSON:
//             subFolder = 'tracks';
//             break;
//         case TYPE_UPLOAD_BUCKET.RELEASE_COVER_ART:
//             subFolder = 'release_cover_art';
//             break;
//         default:
//             subFolder = 'unknown';
//             break;
//     }

//     const trackSegment = fileName ? `/${fileName}` : '';

//     return `${datePrefix}/releases/${releaseId}/${subFolder}${trackSegment}`;
// }
