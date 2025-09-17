import { TenantTiersData } from '.';

export interface CreateTenantTiersPayload extends Partial<TenantTiersData> {}

export interface UpdateTenantTiersPayload extends CreateTenantTiersPayload {}
