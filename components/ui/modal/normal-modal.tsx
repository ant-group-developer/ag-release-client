import { Modal, ModalProps, Spin } from 'antd';
import { ReactNode } from 'react';

export type AppModalProps = {
    children?: ReactNode;
    loading?: boolean;
    spinning?: boolean;
} & ModalProps;

function AppModal({
    loading,
    children,
    spinning = false,
    ...props
}: AppModalProps) {
    return (
        <Modal
            confirmLoading={loading}
            cancelButtonProps={{ disabled: loading }}
            closable={!loading}
            maskClosable={!loading}
            // maskClosable={false}
            {...props}
        >
            <Spin spinning={spinning}>{children}</Spin>
        </Modal>
    );
}

export default AppModal;
