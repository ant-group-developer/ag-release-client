import { CommonParams } from '@/types/api';
import { DISTRIBUTION_STATUS } from '../enum';

export interface DistributionDataFilter extends CommonParams {
    labelId?: string;
    artistId?: string;
    status?: DISTRIBUTION_STATUS;
    startDate?: string;
    endDate?: string;
}
