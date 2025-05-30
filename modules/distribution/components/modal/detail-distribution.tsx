import ActionButton from '@/components/ui/button/action-button';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import AppTable from '@/components/ui/table/normal-table';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ReleasesData } from '@/modules/releases/types';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = Omit<AppModalProps, 'children'> & {};

export default function DetailDistributionModal({ ...props }: Props) {
    const messages = useTranslations();
    const rowData = useModalStore((state) => state.dataEdit) as ReleasesData;
    const closeModal = useModalStore((state) => state.closeModal);

    // Mock data for distribution status - Thay thế bằng API call thực tế sau này
    const distributionData = [
        {
            id: 1,
            thumbnail:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/2048px-Spotify_logo_without_text.svg.png',
            platform: 'Spotify',
            status: 'Delivered',
            creationDate: rowData?.creationDate,
            releaseDate: rowData?.releaseDate,
        },
        {
            id: 2,
            thumbnail:
                'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/571e5943-4616-4654-bf99-10b3c98f8686/d982zrj-a9acb6b3-4e6b-4dda-a381-74fa8a25de00.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzU3MWU1OTQzLTQ2MTYtNDY1NC1iZjk5LTEwYjNjOThmODY4NlwvZDk4Mnpyai1hOWFjYjZiMy00ZTZiLTRkZGEtYTM4MS03NGZhOGEyNWRlMDAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.W197gqXaEzvXa10JXk0NdtrbS4__XYKfhQ323esSjvw',

            platform: 'Apple Music',
            status: 'Delivered',
            creationDate: rowData?.creationDate,
            releaseDate: rowData?.releaseDate,
        },
        {
            id: 3,
            thumbnail:
                'https://inkythuatso.com/uploads/thumbnails/800/2021/11/logo-tiktok-inkythuatso-2-mesa-de-trabajo-1-27-09-13-05.jpg',
            platform: 'TikTok',
            status: 'Delivered',
            creationDate: rowData?.creationDate,
            releaseDate: rowData?.releaseDate,
        },
        {
            id: 4,
            thumbnail:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbhvKe4ebnX7xrphoWADoK-wteStypzRFKWQ&s',
            platform: 'YouTube',
            status: 'Delivered',
            creationDate: rowData?.creationDate,
            releaseDate: rowData?.releaseDate,
        },
        {
            id: 5,
            thumbnail:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Youtube_Music_icon.svg/2048px-Youtube_Music_icon.svg.png',

            platform: 'Amazon Music',
            status: 'Delivered',
            creationDate: rowData?.creationDate,
            releaseDate: rowData?.releaseDate,
        },
    ];

    const columns: ColumnType<any>[] = [
        {
            title: 'Platform',
            dataIndex: 'platform',
            width: 200,
            render: (value, record) => {
                return (
                    <div className="flex items-center gap-2">
                        <div>
                            <Image
                                src={record?.thumbnail}
                                alt="thumbnail"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                        </div>
                        <span className="font-bold">{value}</span>
                    </div>
                );
            },
        },
        {
            title: 'Last Enqueue',
            dataIndex: 'creationDate',
            width: 100,
            align: 'center',
            render: (value) => {
                return (
                    <span>{formattedDate(value, DATE_FORMAT.DATE_ONLY)}</span>
                );
            },
        },
        {
            title: 'Last Delivered',
            dataIndex: 'releaseDate',
            width: 100,
            align: 'center',
            render: (value) => {
                return (
                    <span>{formattedDate(value, DATE_FORMAT.DATE_ONLY)}</span>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            width: 200,
            align: 'left',
            render: (value) => {
                return (
                    <div className="flex items-center justify-between">
                        <span className="text-green-500">{value}</span>
                        <div className="invisible group-hover:visible">
                            <ActionButton />
                        </div>
                    </div>
                );
            },
        },
    ];
    return (
        <AppModal
            {...props}
            onCancel={() => closeModal()}
            footer={false}
            width={1000}
            title="Nền tảng phát hành"
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 rounded-lg bg-zinc-100 p-4">
                    <div className="">
                        <Image
                            src={rowData?.thumbnail}
                            alt="thumbnail"
                            width={120}
                            height={120}
                            className="rounded-lg"
                        />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{rowData?.title}</p>
                        <p className="text-sm text-gray-500">
                            {rowData?.artist}
                        </p>
                    </div>
                </div>

                <div className="max-h-[380px] overflow-y-auto">
                    <AppTable
                        size="large"
                        columns={columns}
                        dataSource={distributionData}
                        scroll={{
                            x: 'max-content',
                        }}
                        rowClassName={() => 'group'}
                    />
                </div>
            </div>
        </AppModal>
    );
}
