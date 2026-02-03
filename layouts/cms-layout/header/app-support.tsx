import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON_BIG } from '@/constants/common';
import { CircleHelp } from 'lucide-react';

type Props = {};

function AppSupport({}: Props) {
    // const { data: dataSetting } = useGetSettingPublic();

    // if (!dataSetting?.telegramSupport) {
    //     return null;
    // }

    return (
        <IconButton
            variant="borderless"
            // onClick={() =>
            //     window.open(
            //         dataSetting?.telegramSupport,
            //         '_blank',
            //         'noopener,noreferrer'
            //     )
            // }
        >
            <CircleHelp size={SIZE_ICON_BIG} />
        </IconButton>
    );
}

export default AppSupport;
