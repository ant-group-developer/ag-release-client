import { ReleaseVideo } from './index';

export interface CreateReleaseVideoPayload extends ReleaseVideo {}
export interface UpdateReleaseVideoPayload extends Partial<ReleaseVideo> {}
