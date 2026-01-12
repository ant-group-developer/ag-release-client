import ActionButton from '@/components/ui/button/action-button';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import AppTable from '@/components/ui/table/normal-table';
import { FALLBACK_IMAGE } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import useModalStore from '@/hooks/use-modal';
import { ReleasesData } from '@/modules/releases/types';
import { useGetLinkReadFile } from '@/modules/upload/hooks/use-get-link-read-file';
import { Image } from 'antd';
import { ColumnType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { distributionData } from '../../constants';

type Props = Omit<AppModalProps, 'children'> & {};

export default function DetailDistributionModal({ ...props }: Props) {
    const messages = useTranslations();
    const dataEdit = useModalStore<ReleasesData>((state) => {
        return state.dataEdit;
    });
    const { linkReadFile } = useGetLinkReadFile(
        dataEdit?.coverArtThumbnails?.['300x300'] as string
    );

    const closeModal = useModalStore((state) => state.closeModal);

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
            dataIndex: 'createdAt',
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
                            src={linkReadFile ?? FALLBACK_IMAGE}
                            alt="thumbnail"
                            width={120}
                            height={120}
                            className="rounded-lg"
                            preview={{
                                maskClassName: 'rounded-lg',
                            }}
                        />
                    </div>
                    <div>
                        <p className="text-2xl font-bold">{dataEdit?.title}</p>
                        <p className="text-sm text-gray-500">
                            {dataEdit?.releaseArtists
                                ?.map((item) => item?.artist?.name)
                                ?.join(' & ')}
                        </p>
                    </div>
                </div>

                <div className="max-h-[380px] overflow-y-auto">
                    <AppTable
                        sticky
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
