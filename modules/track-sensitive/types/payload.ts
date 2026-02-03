import { TrackSensitiveData } from '.';

export interface CreateTrackSensitivePayload
    extends Partial<TrackSensitiveData> {}

export interface UpdateTrackSensitivePayload
    extends CreateTrackSensitivePayload {}
