import type { MessageInstance } from 'antd/es/message/interface';
import type { ModalStaticFunctions } from 'antd/es/modal/confirm';
import type { NotificationInstance } from 'antd/es/notification/interface';

let message: MessageInstance;
let notification: NotificationInstance;
let modal: Omit<ModalStaticFunctions, 'warn'>;

export const setAntdStaticInstances = (
    messageInstance: MessageInstance,
    notificationInstance: NotificationInstance,
    modalInstance: Omit<ModalStaticFunctions, 'warn'>
) => {
    message = messageInstance;
    notification = notificationInstance;
    modal = modalInstance;
};

export { message, modal, notification };
