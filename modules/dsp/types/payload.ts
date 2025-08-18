import { CommonFunction } from '@/types/api';

export interface CreateDspPayload {
    name: string;
    picture?: string | null;
    canLinkArtistProfile: boolean;
}

export interface UpdateDspPayload extends Partial<CreateDspPayload> {}

export interface DeleteDspAction extends CommonFunction {
    dspId: string;
    actionId: string;
}
