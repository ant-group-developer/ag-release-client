import { IssueData } from '@/modules/issues/types';
import { TenantData } from '@/modules/tenant/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface TenantIssueData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    tenantId: string;
    tenant: TenantData;
    issueId: string;
    issue: IssueData;
    score: number;
    startDateAffect: string;
    endDateAffect: string;
    isActive: boolean;
    note: string;
    description: string;
}

export interface TenantIssueDataFilter extends CommonParams {
    issueLevelId?: string;
    issueId?: string;
}
