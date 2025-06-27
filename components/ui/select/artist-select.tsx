import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {};

export default function ArtistSelect({ ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const fakeArtist: SelectProps['options'] = [
        {
            id: 1,
            value: 'Sơn Tùng MTP',
            label: 'Sơn Tùng MTP',
        },
        {
            id: 2,
            value: 'Dương Hoàng Phúc',
            label: 'Dương Hoàng Phúc',
        },
        {
            id: 3,
            value: 'Soobin Hoàng Sơn',
            label: 'Soobin Hoàng Sơn',
        },
    ];
    return (
        <Select
            {...props}
            options={fakeArtist}
            dropdownRender={(menu) => {
                return (
                    <div>
                        {menu}
                        <div className="py-1">
                            <Button
                                type="primary"
                                className="w-full"
                                onClick={() =>
                                    openModal(TYPE_MODAL_ARTIST.CREATE)
                                }
                            >
                                {messages('releases.createArtist')}
                            </Button>
                        </div>
                    </div>
                );
            }}
        />
    );
}
