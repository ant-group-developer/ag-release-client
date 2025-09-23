import { NewsData } from '.';

export interface CreateNewsPayload extends Partial<NewsData> {}

export interface UpdateNewsPayload extends CreateNewsPayload {}
