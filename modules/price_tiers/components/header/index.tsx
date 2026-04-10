import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import ActiveSelect from '@/components/ui/select/active-select';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_PRICE_TIERS } from '../../enums';
import { PriceTiersDataFilter } from '../../types';

type Props = Pick<
    UseFilterProps<PriceTiersDataFilter>,
    'dataFilter' | 'onSearch' | 'onChangeFilter'
> & {
    selectedRowKeys?: React.Key[];
    isReordered?: boolean;
    onSaveOrder?: () => void;
    isUpdatingOrder?: boolean;
};

export default function PriceTiersHeader({
    dataFilter,
    onSearch,
    onChangeFilter,
    selectedRowKeys = [],
    isReordered = false,
    onSaveOrder,
    isUpdatingOrder = false,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="app-header p-2">
            <AppHeaderGroup>
                <AppSearch
                    wrapperClassName="max-w-52"
                    onChange={onSearch}
                    defaultValue={dataFilter.keyword}
                />

                <ActiveSelect
                    className="max-w-52"
                    onChange={(value) => {
                        onChangeFilter({
                            isActive: value,
                        });
                    }}
                    defaultValue={dataFilter.isActive}
                />
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    {selectedRowKeys.length > 0 && (
                        <Button
                            icon={<EditOutlined />}
                            type="primary"
                            onClick={() =>
                                openModal(TYPE_MODAL_PRICE_TIERS.BULK_UPDATE)
                            }
                        >
                            {messages('common.bulkUpdate')}
                        </Button>
                    )}
                    {isReordered && (
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={onSaveOrder}
                            loading={isUpdatingOrder}
                        >
                            Lưu vị trí
                        </Button>
                    )}
                    <CreateButton
                        canCreate={true}
                        text={messages('common.create')}
                        onClick={() => openModal(TYPE_MODAL_PRICE_TIERS.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
