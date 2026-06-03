import { CommonAttribute, CommonParams } from '@/types/api';

export interface ChannelsData extends CommonAttribute {
    name: string;
}

export interface ChannelsSimpleData extends Pick<ChannelsData, 'id' | 'name'> {}

export interface ChannelDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
