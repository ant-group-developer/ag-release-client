import { CommonFunction } from '@/types/api';
import { SettingConfig } from '.';

export type UpdateSettingPayload = Partial<SettingConfig>;

export interface UpdateSetting extends CommonFunction {
    payload: UpdateSettingPayload;
}
