export interface CreateDspPayload {
    name: string;
    picture?: string | null;
    canLinkArtistProfile: boolean;
}

export interface UpdateDspPayload extends Partial<CreateDspPayload> {}
