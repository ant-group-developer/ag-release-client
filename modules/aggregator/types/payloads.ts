import { AggregatorData } from '.';

export interface CreateAggregatorPayload
    extends Pick<
        AggregatorData,
        | 'code'
        | 'name'
        | 'contactEmail'
        | 'deliveryEmail'
        | 'deliveryEmailSubject'
        | 'manualUploadUrl'
    > {}

export interface UpdateAggregatorPayload extends Partial<AggregatorData> {}
