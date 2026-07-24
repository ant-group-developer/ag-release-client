import { QUERY_KEY } from '@/constants/query-key';
import { DistributionListFilter, TimelineQuery } from '../types';

/** Factory query-key cho module distribution-orchestration. */
export const distributionOrchestrationQueryKeys = {
    all: QUERY_KEY.DISTRIBUTION_ORCHESTRATION.KEY,

    // mutations
    submit: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.SUBMIT,
    ],
    approveReview: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.APPROVE_REVIEW,
    ],
    rejectReview: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.REJECT_REVIEW,
    ],
    retry: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.RETRY,
    ],

    // queries
    timelines: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.GET_TIMELINE,
    ],
    timeline: (id: string, query?: TimelineQuery) => [
        ...distributionOrchestrationQueryKeys.timelines(),
        id,
        query ?? {},
    ],
    metrics: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.GET_METRICS,
    ],

    lists: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.GET_LIST,
    ],
    list: (params: DistributionListFilter) => [
        ...distributionOrchestrationQueryKeys.lists(),
        params,
    ],

    ticketLists: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.GET_TICKETS,
    ],
    tickets: (id: string) => [
        ...distributionOrchestrationQueryKeys.ticketLists(),
        id,
    ],
    resolveTicket: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.RESOLVE_TICKET,
    ],

    channelLists: () => [
        distributionOrchestrationQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_ORCHESTRATION.GET_CHANNELS,
    ],
    channels: (id: string) => [
        ...distributionOrchestrationQueryKeys.channelLists(),
        id,
    ],
};
