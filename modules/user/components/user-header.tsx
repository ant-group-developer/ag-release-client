import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { UserAddOutlined } from '@ant-design/icons';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_USER } from '../enums';
import { DataFilterUser } from '../types/data';
import UserHeaderFilter from './user-header-filter';

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

    // const [open, setOpen] = useState(false);
    // const toggleDrawer = () => setOpen(!open);

    return (
        <AppHeader className="app-header">
            <AppHeaderGroup>
                <UserHeaderFilter
                    dataFilter={dataFilter}
                    onChangeFilter={onChangeFilter}
                    canClearFilter={canClearFilter}
                    removeFilter={removeFilter}
                />
                {/* <div>
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
                <Button onClick={toggleDrawer}>
                    <Funnel size={SIZE_ICON_BUTTON} />
                    {messages('common.filter')}
                </Button> */}
            </AppHeaderGroup>

            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
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

            {/* <Drawer
                width={330}
                open={open}
                title={messages('common.filter')}
                onClose={toggleDrawer}
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
            </Drawer> */}
        </AppHeader>
    );
}
