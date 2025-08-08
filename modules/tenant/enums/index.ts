export enum TENANT_TYPE {
    WHITE_LABEL = 'white_label',
    LABEL = 'label',
}

export enum TENANT_ORDER_BY {
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    NAME = 'name',
    EMAIL = 'email',
}

export enum TYPE_MODAL_TENANT {
    UPDATE = 'UPDATE_TENANT',
    CREATE = 'CREATE_TENANT',
}

export enum TENANT_TABS {
    INFO = 'info',
    USER = 'users',
    INTEGRATION = 'integrations',
    TRACK = 'tracks',
    RELEASE = 'releases',
}
