import { Switch, SwitchProps } from 'antd';
import { useTranslations } from 'next-intl';

export type AppSwitchProps = SwitchProps;

const AppSwitch = (props: AppSwitchProps) => {
    const messages = useTranslations();

    return (
        <Switch
            checkedChildren={messages('status.on')}
            unCheckedChildren={messages('status.off')}
            {...props}
        />
    );
};

export default AppSwitch;
