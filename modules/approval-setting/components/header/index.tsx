import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import { useLoading, UseLoadingType } from '@/hooks/use-loading';
import usePermissionStore from '@/hooks/use-permission';
import { Button } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    disabled?: boolean;
    onSubmit: () => void;
};

export default function ApproverSettingHeader({ disabled, onSubmit }: Props) {
    const messages = useTranslations();
    const isLoading = useLoading(UseLoadingType.Mutating);
    const { canUpdate } = usePermissionStore(
        (state) => state.permission.permission
    );
    return (
        <AppHeader>
            <AppHeaderGroup position="end" className="flex-1">
                <Button
                    type="primary"
                    disabled={disabled}
                    onClick={onSubmit}
                    loading={isLoading}
                >
                    {messages('common.submit')}
                </Button>
            </AppHeaderGroup>
        </AppHeader>
    );
}
