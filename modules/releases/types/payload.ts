import { ReleasesData } from '.';
import { RELEASES_TYPE } from '../enums';

export interface CreateReleaseDraftPayload {
    title: string;
    type: RELEASES_TYPE;
    version?: string;
}

export interface UpdateReleaseDraftPayload extends Partial<ReleasesData> {
    releaseCoverArt?: {
        fileId: string;
    } | null;
}
