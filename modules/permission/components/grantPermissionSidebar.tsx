import { stringToNumber } from '@/helpers/common';
import type { OnChangeFilter } from '@/hooks/use-filter';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { GroupSelect } from '@/modules/group/components';
import UserSelect from '@/modules/user/components/user-select';
import { Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { PERMISSION_BASE_ON } from '../constants';
import { DataFilterPermission } from '../types/data';

type Props = {
    dataFilter: DataFilterPermission;
    onChangeFilter: OnChangeFilter<DataFilterPermission>;
};

function GrantPermissionSidebar({ dataFilter, onChangeFilter }: Props) {
    const messages = useTranslations();
    const { type, userId, groupId } = dataFilter;

    const { isAdmin } = useAuth();

    return (
        <div className="pb-5 pt-3">
            <div className="mb-5 border-b border-gray-300 pb-5">
                <h3 className="mb-2 font-semibold uppercase text-gray-500">
                    {messages('user.grantPermissionBy')}
                </h3>
                <Radio.Group
                    value={type}
                    onChange={(e) =>
                        onChangeFilter({
                            type: e.target.value,
                            // groupId: undefined,
                            // userId: undefined,
                        })
                    }
                >
                    {isAdmin && (
                        <Radio value={PERMISSION_BASE_ON.USER}>
                            {messages('user.label')}
                        </Radio>
                    )}
                    <Radio value={PERMISSION_BASE_ON.GROUP}>
                        {messages('group.label')}
                    </Radio>
                </Radio.Group>
            </div>

            {isAdmin && type === 'user' && (
                <div>
                    <h3 className="mb-2 font-semibold uppercase text-gray-500">
                        {messages('user.label')}
                    </h3>
                    <UserSelect
                        value={userId}
                        onChange={(value) =>
                            onChangeFilter({
                                userId: value,
                            })
                        }
                    />
                </div>
            )}

            {type === 'group' && (
                <div>
                    <h3 className="mb-2 font-semibold uppercase text-gray-500">
                        {messages('group.label')}
                    </h3>
                    <GroupSelect
                        value={stringToNumber(groupId)}
                        onChange={(value) =>
                            onChangeFilter({
                                groupId: value,
                            })
                        }
                    />
                </div>
            )}
        </div>
    );
}

export default GrantPermissionSidebar;
