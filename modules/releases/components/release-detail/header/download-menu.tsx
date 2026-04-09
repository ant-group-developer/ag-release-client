import IconButton from '@/components/ui/button/icon-button';
import { SIZE_ICON } from '@/constants/common';
import { useActive } from '@/hooks/use-active';
import { releasesApi } from '@/modules/releases/apis';
import { Dropdown, MenuProps, notification, Spin } from 'antd';
import { AxiosResponse } from 'axios';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

type Props = {};

enum DOWNLOAD_MENU {
    ASSETS = 'assets',
    COVER_ART = 'cover_art',
    CSV_METADATA = 'csv_metadata',
    XLSX = 'xlsx_metadata',
    TXT = 'text_metadata',
}

export default function DownloadMenu({}: Props) {
    const messages = useTranslations();
    const params = useParams();
    const releaseId = params['release-id'];
    const { active, isActive, deActive } = useActive();
    const items: MenuProps['items'] = [
        {
            key: DOWNLOAD_MENU.CSV_METADATA,
            label: 'CSV Metadata',
        },
        {
            key: DOWNLOAD_MENU.XLSX,
            label: 'XLSX Metadata',
        },
        {
            key: DOWNLOAD_MENU.TXT,
            label: 'TXT Metadata',
        },
        {
            key: DOWNLOAD_MENU.ASSETS,
            label: <p className="!min-w-20"> {messages('common.assets')}</p>,
        },
        {
            key: DOWNLOAD_MENU.COVER_ART,
            label: messages('release.coverArt.label'),
        },
    ];

    const extractFilename = (disposition: string) => {
        if (!disposition) return 'Assets';
        const fileNameMatch = disposition?.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
            return fileNameMatch[1].replace(/['"]/g, '');
        }
        return 'Assets';
    };

    const handleDownloadBlobFile = (res: AxiosResponse<any, any>) => {
        if (res.data) {
            const blob = res.data as Blob;
            const url = window.URL.createObjectURL(blob);

            const aElement = document.createElement('a');
            aElement.href = url;

            // Lấy tên file từ headers
            const disposition = res.headers['content-disposition'];
            aElement.download = extractFilename(disposition);
            aElement.style.display = 'none';
            document.body.appendChild(aElement);
            aElement.click();
            aElement.remove();

            window.URL.revokeObjectURL(url);
        }
    };

    const handleMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case DOWNLOAD_MENU.ASSETS:
                active();
                releasesApi
                    .downloadAssets(releaseId as string)
                    .then((res) => {
                        handleDownloadBlobFile(res);
                    })
                    .finally(() => {
                        deActive();
                    });

                break;
            case DOWNLOAD_MENU.COVER_ART:
                active();
                releasesApi
                    .downloadCoverArt(releaseId as string)
                    .then((res) => {
                        handleDownloadBlobFile(res);
                    })
                    .finally(() => {
                        deActive();
                    });
                break;
            case DOWNLOAD_MENU.CSV_METADATA:
                active();
                releasesApi
                    .downloadCsvMetadata(releaseId as string)
                    .then((res) => {
                        handleDownloadBlobFile(res);
                    })
                    .finally(() => {
                        deActive();
                    });
                break;
            case DOWNLOAD_MENU.TXT:
                active();
                releasesApi
                    .downloadTxtMetadata(releaseId as string)
                    .then((res) => {
                        handleDownloadBlobFile(res);
                    })
                    .finally(() => {
                        deActive();
                    });
                break;
            case DOWNLOAD_MENU.XLSX:
                active();
                releasesApi
                    .downloadXlsxMetadata(releaseId as string)
                    .then((res) => {
                        handleDownloadBlobFile(res);
                    })
                    .finally(() => {
                        deActive();
                    });
                break;

            default:
                break;
        }
    };

    useEffect(() => {
        if (isActive) {
            notification.open({
                key: 'download',
                message: messages('common.preparingDownload'),
                description: messages('common.preparingDownloadDesc'),
                icon: <Spin spinning={true} />,
                placement: 'top',
                duration: 0,
            });
        } else {
            notification.destroy('download');
        }
    }, [isActive]);

    return (
        <Dropdown
            menu={{ items, onClick: handleMenuClick }}
            trigger={['click']}
            placement="bottomRight"
        >
            <IconButton shape="circle">
                <Download size={SIZE_ICON} />
            </IconButton>
        </Dropdown>
    );
}
