import { ORDER_TYPE } from '@/modules/order/enums';
import { UserData } from '@/modules/user/types/data';

export interface TopUserData {
    name: string;
    userCreatorId: UserData['id'];
    count: number;
}

export interface TopUserFilter {
    startDate: string;
    endDate: string;
    typeOrder?: ORDER_TYPE;
    productTypeId?: string;
}
