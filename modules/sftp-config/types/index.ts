import { AggregatorData, SftpMetadata } from '@/modules/aggregator/types';
import { DspData } from '@/modules/dsp/types';
import { CommonAttribute } from '@/types/api';

export interface SftpConfigData extends CommonAttribute {
    dspId: DspData['id'];
    aggregatorId: AggregatorData['id'];
    metadata: SftpMetadata;
}
