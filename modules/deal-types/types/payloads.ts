import { DealTypeData } from '.';

export interface CreateDealTypePayload extends Partial<DealTypeData> {}

export interface UpdateDealTypePayload extends CreateDealTypePayload {}
