import ActionButton from '@/components/ui/button/action-button';
import SortableTable, {
    OnDragEnd,
    SortableTableProps,
} from '@/components/ui/table/sortable-table';
import { LOCALE } from '@/enums/common';
import useModalStore from '@/hooks/use-modal';
import { ColorPicker, Switch } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useLocale, useTranslations } from 'next-intl';
import { TYPE_MODAL_PRODUCT_TYPE } from '../../enums';
import { useUpdateProductTypeOrder } from '../../hooks/use-update-product-type-order';
import { ProductTypeData } from '../../types';
import DriveIconImage from './drive-icon-image';

type Props = {} & Omit<SortableTableProps<ProductTypeData>, 'columns'>;

export default function ProductTypesTable({ ...props }: Props) {
    const locale = useLocale();
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { updateProductTypeOrder } = useUpdateProductTypeOrder();

    const handleDragEnd: OnDragEnd<ProductTypeData[]> = (newData) => {
        const payload = newData.map((item, index) => ({
            id: item.id,
            order: index + 1,
        }));

        updateProductTypeOrder({
            payload: { data: payload },
            onSuccess: () => {},
            onError: () => {},
        });
    };

    const columns: ColumnType<ProductTypeData>[] = [
        {
            key: 'sort',
            width: 50,
            align: 'center',
        },
        {
            title: messages('common.iNo'),
            dataIndex: '',
            key: '',
            align: 'center',
            width: 50,
            render: (_, __, index) => index + 1,
        },
        {
            title: messages('common.icon'),
            dataIndex: 'googleDriveIconId',
            key: 'googleDriveIconId',
            align: 'center',
            width: 80,
            render: (value) => {
                return (
                    <DriveIconImage
                        googleDriveFileId={value}
                        className="aspect-video overflow-hidden rounded-lg object-contain"
                    />
                );
            },
        },
        {
            title: messages('common.code'),
            dataIndex: 'code',
            key: 'code',
            align: 'center',
            width: 100,
        },
        {
            title: messages('productType.name'),
            dataIndex: locale === LOCALE.VI ? 'nameVi' : 'nameEn',
            key: 'name',
            align: 'left',
            width: 100,
        },
        {
            title: messages('common.color'),
            dataIndex: 'color',
            key: 'color',
            align: 'center',
            width: 100,
            render: (value) => <ColorPicker value={value} disabled showText />,
        },
        {
            title: messages('productType.isUseThumbailable'),
            dataIndex: 'isThumbnailable',
            key: 'isThumbnailable',
            align: 'center',
            width: 100,
            render: (value) => <Switch value={value} disabled />,
        },
        {
            title: messages('productType.field.fieldType'),
            dataIndex: 'fieldType',
            key: 'fieldType',
            align: 'center',
            width: 100,
        },
        {
            title: messages('productType.field.acceptFile'),
            dataIndex: 'acceptFile',
            key: 'acceptFile',
            align: 'center',
            width: 100,
        },
        {
            title: messages('productType.productCount'),
            dataIndex: 'productCount',
            key: 'productCount',
            align: 'center',
            width: 100,
        },
        {
            title: messages('productType.note'),
            dataIndex: 'note',
            key: 'note',
            align: 'left',
            width: 150,
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            width: 100,
            render: (value, record) => {
                const productCount = record.productCount;
                return (
                    <ActionButton
                        showDelete={!productCount || productCount <= 0}
                        onShowDelete={() =>
                            openModal(TYPE_MODAL_PRODUCT_TYPE.DELETE, record)
                        }
                        showUpdate
                        onShowUpdate={() =>
                            openModal(TYPE_MODAL_PRODUCT_TYPE.UPDATE, record)
                        }
                    />
                );
            },
        },
    ];

    return (
        <SortableTable
            key="main"
            {...props}
            pagination={false}
            columns={columns}
            rowClassName={() => 'group'}
            onDragEnd={handleDragEnd}
        />
    );
}
