import { SIZE_ICON } from '@/constants/common';
import GoogleDriveEmbedModal from '@/modules/order/components/modal/google-drive-embed';
import { useGetSettingPublic } from '@/modules/setting/hooks/use-get-setting';
import { Button } from 'antd';
import { Info } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Fragment, useState } from 'react';

export default function AppGuide() {
    const [openGuide, setOpenGuide] = useState(false);
    const messages = useTranslations();

    const { data: dataSetting } = useGetSettingPublic();

    const handleToggleGuideModal = () => {
        setOpenGuide((prev) => !prev);
    };
    return (
        dataSetting?.guideFileGoogleDriveId && (
            <Fragment>
                <Button
                    onClick={handleToggleGuideModal}
                    icon={
                        <div>
                            <Info size={SIZE_ICON} />
                        </div>
                    }
                    className="flex items-center justify-center"
                >
                    {messages('common.guide')}
                </Button>
                <GoogleDriveEmbedModal
                    width={1200}
                    onClose={handleToggleGuideModal}
                    open={openGuide}
                    fileId={dataSetting?.guideFileGoogleDriveId}
                />
            </Fragment>
        )
    );
}
