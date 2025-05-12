export enum TYPE_MODAL_PRODUCT {
    CREATE = 'create',
    UPDATE = 'update',
    DETAIL = 'detail',
    DELETE = 'delete',
    UPLOAD = 'upload',
    COMMENT = 'comment',
    ASSIGN_USER = 'assignUser',
    APPROVER_USER = 'approverUser',
    REMOVE_USER = 'removeUser',
}

export enum PRODUCT_TYPE_FILTER {
    DROPDOWN = 'DROPDOWN',
    KEYWORD = 'KEYWORD',
    STATUS = 'STATUS',
    TYPE = 'TYPE',
    TOPIC = 'TOPIC',
    CREATOR = 'CREATOR',
    ASSIGNEE = 'ASSIGNEE',
    CODE = 'CODE',
    DATE_CREATED = 'DATE_CREATED',
    DEADLINE = 'DEADLINE',
}

export enum COLUMN_PRODUCT_DISPLAY {
    PRODUCT = 'product',
    CODE = 'code',
    CREATOR = 'userCreatorId',
    ASSIGNEE = 'assigneeId',
    APPROVER = 'approverId',
    CONTENT = 'content',
    DESCRIPTION = 'description',
    TYPE = 'type',
    STATUS = 'status',
    DATE_CREATED = 'dateCreated',
    DEADLINE = 'deadline',
    ACTION = 'action',
    PRIORITY = 'priority',
    RATE = 'rate',
}

export enum FILE_ORIENTATION {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

export enum PRODUCT_TYPE {
    IMAGE = 'image',
    VIDEO = 'video',
    SOURCE = 'source',
}

export enum PRODUCT_STATUS {
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
