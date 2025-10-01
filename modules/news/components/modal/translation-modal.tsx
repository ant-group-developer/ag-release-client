import ActionButton from '@/components/ui/button/action-button';
import CreateButton from '@/components/ui/button/create-button';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import FullScreenModal from '@/components/ui/modal/fullScreenModal';
import { AppModalProps } from '@/components/ui/modal/normal-modal';
import AppProTable from '@/components/ui/table/pro-table';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ProColumns } from '@ant-design/pro-components';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useGetListNewsWithTranslate } from '../../hooks/use-get-list-news-with-translate';
import { NewsData } from '../../types';
import TranslateFormModal from './add-translation-form';

type Props = Omit<AppModalProps, 'children'> & {};

export default function TranslationModal({ ...props }: Props) {
    const messages = useTranslations();
    const typeModal = useModalStore((state) => state.typeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as NewsData);
    // const { active, isActive, deActive } = useActive();
    const openModal = useModalStore((state) => state.openModal);
    const { newsData, isFetching } = useGetListNewsWithTranslate(dataEdit?.id);
    const [openAddTranslate, setOpenAddTranslate] = useState(false);
    const [openDeleteTranslate, setOpenDeleteTranslate] = useState(false);
    const [openEditTranslate, setOpenEditTranslate] = useState({
        isOpen: false,
        record: {},
    });

    const columns: ProColumns<NewsData>[] = [
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
            key: 'iNo',
            width: 200,
            align: 'center',
            search: false,
            render: (_, record) => (
                <span>{`${record?.languageName} - ${record?.languageCode}`}</span>
            ),
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
            width: 200,
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
            width: 100,
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
                        setOpenDeleteTranslate(true);
                    }}
                />
            ),
        },
    ];

    return (
        <FullScreenModal
            {...props}
            title={messages('common.translation')}
            footer={null}
            loading={isFetching}
            showAction={false}
        >
            <div className="m-auto max-w-screen-xl pt-4">
                <div className="flex justify-end pb-2">
                    <CreateButton
                        canCreate
                        onClick={() =>
                            setOpenEditTranslate({ isOpen: true, record: {} })
                        }
                    />
                </div>
                <AppProTable
                    options={false}
                    columns={columns}
                    dataSource={newsData}
                    loading={isFetching}
                />
                {/* <TranslateFormModal
                    open={openAddTranslate}
                    onCancel={() => setOpenAddTranslate(false)}
                /> */}
                <TranslateFormModal
                    open={openEditTranslate.isOpen}
                    onCancel={() => {
                        setOpenEditTranslate({ isOpen: false, record: {} });
                    }}
                />
                <AppConfirm
                    open={openDeleteTranslate}
                    // onOk={() => handleDelete()}
                    onCancel={() => setOpenDeleteTranslate(false)}
                    modalTitle={`${messages('common.delete')} ${messages('common.translation').toLowerCase()}`}
                    paragraph={messages('action.delete.alert', {
                        label: '',
                    })}
                />
            </div>
        </FullScreenModal>
    );
}
