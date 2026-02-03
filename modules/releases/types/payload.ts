import { ReleasesData } from '.';

export interface CreateReleaseDraftPayload {
    title: string;
    albumFormatId: string;
    version?: string;
    labelId: string;
}

export interface UpdateReleaseDraftPayload extends Partial<ReleasesData> {
    releaseCoverArt?: {
        fileId: string;
    } | null;
}
