import { CommonFunction } from '@/types/api';
import { SettingData } from '.';

export interface UpdateSettingPayload extends Partial<SettingData> {}

export interface UpdateSetting extends CommonFunction {
    payload: UpdateSettingPayload;
}
