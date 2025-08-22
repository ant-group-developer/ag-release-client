import IconButton from '@/components/ui/button/icon-button';
import { CircleHelp } from 'lucide-react';

type Props = {};

function AppSupport({}: Props) {
    // const { data: dataSetting } = useGetSettingPublic();

    // if (!dataSetting?.telegramSupport) {
    //     return null;
    // }

    return (
        <IconButton
            variant="outlined"
            // onClick={() =>
            //     window.open(
            //         dataSetting?.telegramSupport,
            //         '_blank',
            //         'noopener,noreferrer'
            //     )
            // }
        >
            <CircleHelp size={16} />
        </IconButton>
    );
}

export default AppSupport;
