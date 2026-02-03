import { TenantIssueData } from '.';

export interface CreateTenantIssuePayload extends Partial<TenantIssueData> {}

export interface UpdateTenantIssuePayload extends CreateTenantIssuePayload {}
