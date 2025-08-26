import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import AppSidebarSectionTitleOnly from '@/components/cms/app-sidebar-section-title-only';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { SIZE_ICON_BUTTON } from '@/constants/common';
import { arrayFromString, arrayToString } from '@/helpers/array';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import TenantTreeSelect from '@/modules/tenant/components/tenant-tree-select';
import { UserAddOutlined } from '@ant-design/icons';
import { Button, Drawer } from 'antd';
import { Funnel, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { TYPE_MODAL_USER } from '../enums';
import { DataFilterUser } from '../types/data';
import UserTypeSelect from './user-type-select';

type Props = {} & Pick<
    UseFilterProps<DataFilterUser>,
    'onChangeFilter' | 'canClearFilter' | 'removeFilter' | 'dataFilter'
>;

export default function UserHeader({
    dataFilter,
    canClearFilter,
    onChangeFilter,
    removeFilter,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { isNotSystemTenant } = useAuth();

    const [open, setOpen] = useState(false);
    const toggleDrawer = () => setOpen(!open);

    return (
        <AppHeader className="app-header px-0 pb-3">
            <AppHeaderGroup>
                {/* <UserHeaderFilter
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                /> */}
                <div>
                    <AppSearch
                        className="max-w-60"
                        placeholder={messages('user.search.keyword')}
                    />
                </div>
                {canClearFilter && (
                    <Button
                        onClick={removeFilter}
                        className="flex items-center gap-2 rounded-2xl border border-gray-300 px-4 py-1 hover:bg-gray-100"
                    >
                        <X size={SIZE_ICON_BUTTON} />{' '}
                        {messages('common.removeFilter')}
                    </Button>
                )}
            </AppHeaderGroup>

            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <Button onClick={toggleDrawer}>
                        <Funnel size={SIZE_ICON_BUTTON} />
                        {messages('common.filter')}
                    </Button>
                    {isNotSystemTenant && (
                        <CreateButton
                            canCreate={true}
                            text={messages('action.invite.title', {
                                label: messages('user.label'),
                            })}
                            onClick={() => openModal(TYPE_MODAL_USER.INVITE)}
                            ghost
                            icon={<UserAddOutlined />}
                        />
                    )}
                    <CreateButton
                        canCreate={true}
                        text={messages('action.create.title', {
                            label: messages('user.label'),
                        })}
                        onClick={() => openModal(TYPE_MODAL_USER.CREATE)}
                    />
                </div>
            </AppHeaderGroup>

            <Drawer
                width={330}
                open={open}
                title={messages('common.filter')}
                onClose={toggleDrawer}
                closeIcon={null}
            >
                <div className="space-y-4">
                    <AppSidebarSectionTitleOnly title={messages('user.type')}>
                        <UserTypeSelect
                            mode="multiple"
                            value={arrayFromString(dataFilter.type)}
                            onChange={(value) =>
                                onChangeFilter({ type: arrayToString(value) })
                            }
                        />
                    </AppSidebarSectionTitleOnly>

                    <AppSidebarSectionTitleOnly
                        title={messages('user.search.id')}
                    >
                        <AppSearch
                            defaultValue={dataFilter.id}
                            onChange={(e) =>
                                onChangeFilter({ id: e.target.value?.trim() })
                            }
                        />
                    </AppSidebarSectionTitleOnly>

                    <AppSidebarSectionTitleOnly
                        title={messages('tenant.label')}
                    >
                        <TenantTreeSelect
                            multiple
                            value={arrayFromString(dataFilter.tenantIds)}
                            onChange={(value) =>
                                onChangeFilter({
                                    tenantIds: arrayToString(value),
                                })
                            }
                        />
                    </AppSidebarSectionTitleOnly>

                    {canClearFilter && (
                        <Button
                            block
                            onClick={removeFilter}
                            className="flex items-center gap-2 rounded-2xl border border-gray-300 px-4 py-1 hover:bg-gray-100"
                        >
                            <X size={SIZE_ICON_BUTTON} />{' '}
                            {messages('common.removeFilter')}
                        </Button>
                    )}
                </div>
            </Drawer>
        </AppHeader>
    );
}
