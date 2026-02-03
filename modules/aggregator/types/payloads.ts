import { AggregatorData } from '.';

export interface CreateAggregatorPayload
    extends Pick<AggregatorData, 'code' | 'name' | 'contactEmail'> {}

export interface UpdateAggregatorPayload extends Partial<AggregatorData> {}
