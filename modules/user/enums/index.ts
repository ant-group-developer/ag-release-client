export enum USER_TYPE {
    ADMIN = 'admin',
    USER = 'user',
}
export enum USER_ORDER_BY {
    LAST_LOGIN = 'lastLogin',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    NAME = 'name',
    EMAIL = 'email',
    LOGIN_COUNT = 'loginsCount',
}

export enum TYPE_MODAL_USER {
    UPDATE = 'UPDATE_USER',
    CREATE = 'CREATE_USER',
    INVITE = 'INVITE_USER',
    PERMISSION = 'PERMISSION',
}
