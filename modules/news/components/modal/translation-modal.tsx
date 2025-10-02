import ActionButton from '@/components/ui/button/action-button';
import CreateButton from '@/components/ui/button/create-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import AppProTable from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { SIZE_ICON } from '@/constants/common';
import { SCREEN } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { DeleteVariables } from '@/types/api';
import { ProColumns } from '@ant-design/pro-components';
import { CircleCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDeleteTranslation } from '../../hooks/use-delete-translation';
import { useGetListTranslations } from '../../hooks/use-get-list-translations';
import { NewsData, TranslationData } from '../../types';
import TranslateFormModal from './translation-form';

type Props = Omit<AppModalProps, 'children'> & {};

export default function TranslationModal({ ...props }: Props) {
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as NewsData);
    // const { active, isActive, deActive } = useActive();
    const openModal = useModalStore((state) => state.openModal);
    const { translationData, isFetching } = useGetListTranslations(
        dataEdit?.id
    );
    const { deleteTranslation } = useDeleteTranslation();
    const [openAddTranslate, setOpenAddTranslate] = useState(false);
    const [openDeleteTranslate, setOpenDeleteTranslate] = useState<{
        isOpen: boolean;
        record: TranslationData | null;
    }>({
        isOpen: false,
        record: null,
    });
    const [openEditTranslate, setOpenEditTranslate] = useState<{
        isOpen: boolean;
        record: TranslationData | null;
    }>({
        isOpen: false,
        record: null,
    });

    const columns: ProColumns<TranslationData>[] = [
        {
            title: messages('common.iNo'),
            key: 'iNo',
            width: 50,
            align: 'center',
            search: false,
            render: (_, __, index) => (index = index + 1),
        },
        {
            title: messages('language.label'),
            key: 'language',
            width: 150,
            align: 'center',
            search: false,
            render: (_, record) => {
                return (
                    <div className="flex items-center justify-center gap-2">
                        <span>{`${record?.languageName} - ${record?.languageCode}`}</span>
                        {record?.isDefault && (
                            <CustomTooltip
                                title={messages('language.original')}
                            >
                                <CircleCheck
                                    size={SIZE_ICON}
                                    className="cursor-pointer text-green-500"
                                />
                            </CustomTooltip>
                        )}
                    </div>
                );
            },
        },
        {
            title: messages('common.creator'),
            key: 'creator',
            dataIndex: 'creator',
            align: 'left',
            width: 150,
            fieldProps: {
                placeholder: '',
            },
            search: false,
            render: (value, record) => (
                <CustomTooltip title={record?.creator?.email}>
                    <span className="truncate">{record?.creator?.email}</span>
                </CustomTooltip>
            ),
        },
        {
            title: messages('common.createdAt'),
            key: 'createdAt',
            dataIndex: 'createdAt',
            align: 'center',
            width: 100,
            fieldProps: {
                placeholder: '',
            },
            search: false,
            render: (value, record) => {
                return (
                    <span className="truncate text-wrap">
                        {' '}
                        {formattedDate(record?.createdAt)}{' '}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            align: 'center',
            width: 50,
            fixed: 'right',
            search: false,
            render: (_, record) => (
                <ActionButton
                    showUpdate
                    showDelete
                    onShowUpdate={() => {
                        setOpenEditTranslate({ isOpen: true, record: record });
                    }}
                    onShowDelete={() => {
                        setOpenDeleteTranslate({ isOpen: true, record });
                    }}
                />
            ),
        },
    ];

    const handleDeleteTranslation = () => {
        const variables: DeleteVariables<TranslationData['id']> = {
            id: openDeleteTranslate?.record?.id as string,
            onSuccess: () => {
                setOpenDeleteTranslate({ isOpen: false, record: null });
            },
            onError: () => {
                setOpenDeleteTranslate({ isOpen: false, record: null });
            },
        };
        deleteTranslation(variables);
    };

    return (
        <AppModal
            {...props}
            title={messages('common.translations')}
            footer={null}
            loading={isFetching}
            width={SCREEN.XXL}
            // showAction={false}
        >
            {/* <div className="m-auto max-w-screen-xl"> */}
            <div className="flex justify-end pb-2">
                <CreateButton
                    canCreate
                    onClick={() =>
                        setOpenEditTranslate({ isOpen: true, record: null })
                    }
                />
            </div>
            <AppProTable
                options={false}
                columns={columns}
                dataSource={translationData}
                loading={isFetching}
            />
            {/* <TranslateFormModal
                    open={openAddTranslate}
                    onCancel={() => setOpenAddTranslate(false)}
                /> */}
            <TranslateFormModal
                open={openEditTranslate.isOpen}
                onCancel={() => {
                    setOpenEditTranslate({
                        isOpen: false,
                        record: null,
                    });
                }}
                translationId={openEditTranslate?.record?.id}
            />
            <AppConfirm
                open={openDeleteTranslate.isOpen}
                onOk={() => handleDeleteTranslation()}
                onCancel={() =>
                    setOpenDeleteTranslate({ isOpen: false, record: null })
                }
                modalTitle={`${messages('common.delete')} ${messages('common.translation').toLowerCase()}`}
                paragraph={messages('action.delete.alert', {
                    label: `${openDeleteTranslate?.record?.languageCode} - ${openDeleteTranslate?.record?.languageName}`,
                })}
            />
            {/* </div> */}
        </AppModal>
    );
}
