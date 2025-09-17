import { IssueLevelData } from '@/modules/issue-level/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface IssueData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    nameVi: string;
    nameEn: string;
    code: string;
    color: string;
    score: number;
    note: string;
    numberOfDaysAffect: number;
    issueLevelId: string;
    issueLevel: IssueLevelData;
    description: string;
}

export interface IssueDataFilter extends CommonParams {}
