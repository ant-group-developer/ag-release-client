import { SIZE_ICON_BUTTON } from '@/constants/common';
import { Button, ButtonProps } from 'antd';
import { FileSpreadsheet } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
    text?: string;
} & ButtonProps;

function ExportExcelButton({ text, ...props }: Props) {
    const messages = useTranslations();
    return (
        <Button
            type="primary"
            icon={<FileSpreadsheet size={SIZE_ICON_BUTTON} />}
            className="flex items-center justify-center"
            {...props}
        >
            {text ?? messages('common.exportExcel')}
        </Button>
    );
}

export default ExportExcelButton;
