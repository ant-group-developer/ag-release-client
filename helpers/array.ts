import { ARRAY_SEPARATOR } from '@/constants/common';
import { cloneDeep } from 'lodash';

export const removeEmptyChildren = (data: any[]) => {
    let tempData = cloneDeep(data);
    tempData = tempData.map((item) => {
        const childLength = item?.children?.length || 0;
        if (childLength > 0) {
            return {
                ...item,
                childLength,
                children: removeEmptyChildren(item?.children),
            };
        }
        const newItem = { ...item };
        newItem.children = null;
        return newItem;
    });
    return tempData;
};

export function arrayToString(
    value: any,
    separator: string = ARRAY_SEPARATOR
): string | undefined {
    if (Array.isArray(value) && value.length > 0) {
        return value.join(separator);
    }
    return undefined;
}

export function arrayFromString(
    value: any,
    separator: string = ARRAY_SEPARATOR
): string[] | undefined {
    if (typeof value === 'string') {
        return value.split(separator);
    }
    return undefined;
}
