import { IssueData } from '.';

export interface CreateIssuePayload extends Partial<IssueData> {}

export interface UpdateIssuePayload extends CreateIssuePayload {}
