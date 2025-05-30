'use client';
import AppConfirm from '@/components/ui/modal/confirm-modal';
import AppPagination from '@/components/ui/pagination';
import { SCREEN } from '@/enums/common';
import { useFilter } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';

import LabelsHeader from '@/modules/labels/components/header';
import LabelFormModal from '@/modules/labels/components/modal/create-label';
import { LabelsTable } from '@/modules/labels/components/table';
import { fakeLabelData } from '@/modules/labels/constants';
import { TYPE_MODAL_LABEL } from '@/modules/labels/enum';
import { LabelDataFilter } from '@/modules/labels/types';
import { useWindowSize } from '@uidotdev/usehooks';
import { useTranslations } from 'next-intl';

type Props = {};

export default function Labels({}: Props) {
    const messages = useTranslations();
    const {
        dataFilter,
        onChangeFilter,
        onChangePage,
        canClearFilter,
        removeFilter,
    } = useFilter<LabelDataFilter>({
        page: 1,
        pageSize: 21,
    });

    const typeModal = useModalStore((state) => state.typeModal);
    const closeModal = useModalStore((state) => state.closeModal);

    const handleRefresh = () => {};

    const { height, width } = useWindowSize();

    const isSmallDevice = Number(width) <= SCREEN.MD;

    const scrollY = () => {
        if (isSmallDevice) return undefined;
        if (!height) return undefined;
        const minHeight = 300;
        // const headerFooterHeight = 216;
        const headerFooterHeight = 210;
        const value = height - headerFooterHeight;
        if (value > minHeight) return value;
        return minHeight;
    };

    return (
        <div className="flex h-full flex-col justify-between overflow-hidden">
            <div className="flex-1">
                <LabelsHeader
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                    handleRefresh={handleRefresh}
                />
                <LabelsTable
                    dataSource={fakeLabelData}
                    scroll={{ x: SCREEN.XXL, y: scrollY() }}
                />
            </div>

            {(typeModal === TYPE_MODAL_LABEL.CREATE ||
                typeModal === TYPE_MODAL_LABEL.EDIT) && <LabelFormModal />}

            {typeModal === TYPE_MODAL_LABEL.DELETE && (
                <AppConfirm
                    open
                    onCancel={closeModal}
                    modalTitle={`${messages('common.delete')} label`}
                    paragraph="Bạn có chắc chắn muốn xóa label này không?"
                />
            )}

            <AppPagination
                className="border-b border-t"
                align="end"
                current={dataFilter.page}
                pageSize={dataFilter.pageSize}
                total={fakeLabelData.length}
                onChange={onChangePage}
                showTotalText
                showSizeChanger
                showQuickJumper
                pageSizeOptions={[21, 28, 32]}
            />
        </div>
    );
}
