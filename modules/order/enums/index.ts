export enum ORDER_STATUS {
    NEW = 'new',
    IN_PROGRESS = 'in_progress',
    PENDING_LEADER_APPROVAL = 'pending_leader_approval',
    PENDING_APPROVAL = 'pending_approval',
    LEADER_REJECT = 'leader_reject',
    COMPLETED = 'completed',
    REJECT = 'reject',
    OVERDUE = 'overdue',
    CANCEL = 'cancel',
}

export enum TYPE_MODAL {
    GUIDE = 'guide',
}

export enum TYPE_MODAL_ORDER {
    CREATE = 'create',
    UPDATE = 'update',
    DETAIL = 'detail',
    DELETE = 'delete',
    COMMENT = 'comment',
    CANCEL = 'cancel',
    CONTINUE = 'continue',
    USED_STATUS = 'used_status',
}

export enum ORDER_TYPE_FILTER {
    DROPDOWN = 'dropdown',
    KEYWORD = 'keyword',
    CODE = 'code',
    TYPE = 'type',
    TOPIC = 'topic',
    DEADLINE = 'deadline',
    STATUS = 'status',
    CREATOR = 'creator',
    ASSIGNEE = 'assignee',
    IS_ACTIVE = 'is_active',
}

export enum ORDER_TYPE {
    IMAGE = 'image',
    VIDEO = 'video',
    VIDEO_AND_THUMBNAIL = 'thumb_video',
    SOURCE = 'source',
}

export enum PRODUCT_INFO_TAB {
    IMAGE = 'image',
    VIDEO = 'video',
    HISTORY = 'history',
    SOURCE = 'source',
}

export enum USED_STATUS {
    USED = 'used',
    NOT_USED = 'not_used',
    NULL = 'null',
}

export enum STATUS_ASSIGNEE {
    ASSIGNED = 'assigned',
    UNASSIGNED = 'unassigned',
    ALL = 'all',
}

export enum COLUMN_ORDER_DISPLAY {
    Product = 'urlProduct',
    Code = 'code',
    Creator = 'userCreatorId',
    Assignee = 'assignee',
    Content = 'content',
    Status = 'status',
    UsedStatus = 'used_status',
    OrderType = 'type',
    DateCreated = 'dateCreated',
    Deadline = 'deadline',
    Action = 'action',
    Priority = 'priority',
}
