export enum TYPE_MODAL_DSP {
    CREATE = 'create',
    UPDATE = 'update',
    DELETE = 'delete',
}

export enum DSP_DEAL {
    AGGREGATOR = 'aggregator',
    DIRECT = 'direct',
    SYSTEM_DEFAULT = 'system',
}

export enum STORAGE_TYPE {
    SFTP = 'SFTP',
    S3 = 'S3',
}

export enum DSP_TYPE {
    AUDIO = 'audio',
    VIDEO = 'video',
}

export enum DSP_TABLE_KEY {
    NAME = 'name',
    CODE = 'code',
    CODE_CI = 'codeCi',
    DDEX_ID = 'ddexId',
    DDEX_NAME = 'ddexName',
    IS_ACTIVE = 'isActive',
    ENABLE_POLICY = 'enablePolicy',
    IS_DEFAULT = 'isDefault',
    HAS_DEAL = 'hasDeal',
    DSP_ROUTING_CONFIG = 'dspRoutingConfig',
    CREATED_AT = 'createdAt',
    UPDATED_AT = 'updatedAt',
    ACTION = '',
}
