import { toNonAccentVietnamese } from '@/helpers/string';
import { PermissionGate } from '@/modules/auth/components/permission-gate';
import { PERMISSION } from '@/modules/auth/constants/permission';
import LabelFormModal from '@/modules/labels/components/modal/label-form';
import { useGetListLabelsSimple } from '@/modules/labels/hooks/use-get-list-simple-labels';
import { LabelData } from '@/modules/labels/types';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = SelectProps & {
    fallBack?: string;
    showCreate?: boolean;
    onCreateSuccess?: (data: LabelData) => void;
};

export default function LabelSelect({
    fallBack,
    showCreate = false,
    onCreateSuccess,
    ...props
}: Props) {
    const messages = useTranslations();
    const [openCreate, setOpenCreate] = useState(false);
    const { labelsData } = useGetListLabelsSimple();

    const option = labelsData?.map((item) => {
        return {
            id: item.id,
            value: item.id,
            label: item.name,
        };
    });

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <>
            <Select
                {...props}
                showSearch
                filterOption={(input, option) =>
                    toNonAccentVietnamese(option?.label ?? '')
                        .toLowerCase()
                        .includes(toNonAccentVietnamese(input).toLowerCase())
                }
                options={option}
                labelRender={labelRender}
                popupRender={(menu) => {
                    return (
                        <div>
                            {menu}
                            {showCreate && (
                                <PermissionGate
                                    permission={PERMISSION.LABEL.CREATE}
                                >
                                    <div className="flex w-full pt-2">
                                        <Button
                                            type="primary"
                                            className="w-full"
                                            onClick={() => setOpenCreate(true)}
                                        >
                                            {messages('common.create')} label
                                        </Button>
                                    </div>
                                </PermissionGate>
                            )}
                        </div>
                    );
                }}
            />
            <LabelFormModal
                open={openCreate}
                onCancel={() => setOpenCreate(false)}
                onCreateSuccess={(data) => {
                    setOpenCreate(false);
                    onCreateSuccess?.(data);
                }}
            />
        </>
    );
}
