import { CommonParams } from '@/types/api';
import { REVENUE_ADVANCED } from '../enums';

export interface RevenueAdvancedDataFilter extends CommonParams {
    analyticsType: REVENUE_ADVANCED;
}
