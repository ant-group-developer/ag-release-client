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
            value: 'Artist 1',
            label: 'Artist 1',
        },
        {
            id: 2,
            value: 'Artist 2',
            label: 'Artist 2',
        },
        {
            id: 3,
            value: 'Artist 3',
            label: 'Artist 3',
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
                        <div className="flex justify-end py-2">
                            <Button
                                type="primary"
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
