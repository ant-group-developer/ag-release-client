export enum EXECUTION_STATUS {
    PENDING = 'pending',
    EXECUTED = 'executed',
    REJECTED = 'rejected',
}

export interface AuditLog {
    id: string;
    actor: string;
    action: string;
    status: EXECUTION_STATUS;
    timestamp: string;
    note?: string;
}
