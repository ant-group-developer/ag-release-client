import { Button } from 'antd';
import { CircleHelp } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {};

function AppSupport({}: Props) {
    const messages = useTranslations();
    // const { data: dataSetting } = useGetSettingPublic();

    // if (!dataSetting?.telegramSupport) {
    //     return null;
    // }

    return (
        <Button
        // onClick={() =>
        //     window.open(
        //         dataSetting?.telegramSupport,
        //         '_blank',
        //         'noopener,noreferrer'
        //     )
        // }
        >
            <CircleHelp size={16} /> {messages('common.support')}
        </Button>
    );
}

export default AppSupport;
