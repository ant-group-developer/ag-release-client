import { RELEASES_STATUS } from '../enums';

export const getReleaseStatusColor = (
    status: RELEASES_STATUS | string
): string => {
    switch (status) {
        case RELEASES_STATUS.DRAFT:
            return '#d9d9d9';
        case RELEASES_STATUS.PROCESSING:
            return '#1677FF';
        case RELEASES_STATUS.SUBMITTED:
            return '#73D13D';
        case RELEASES_STATUS.AWAITING_ACTION:
            return '#FA8C16';
        case RELEASES_STATUS.FAILED:
            return '#F5222D';
        case RELEASES_STATUS.TAKEN_DOWN:
            return '#FAAD14';
        case RELEASES_STATUS.DISTRIBUTED:
            return '#52C41A';
        case RELEASES_STATUS.PARTIALLY_FAILED:
            return '#FA541C';
        case RELEASES_STATUS.UNRELEASED:
            return '#1677FF';
        default:
            return '#d9d9d9';
    }
};
export * from './link';
