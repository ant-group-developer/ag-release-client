import { RevenueData } from '.';

export interface RevenuePayload extends Partial<RevenueData> {}

export interface UpdateRevenuePayload extends RevenuePayload {}
