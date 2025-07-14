import useModalStore from '@/hooks/use-modal';
import { TYPE_MODAL_ARTIST } from '@/modules/artist/enum';
import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
import { ArtistData } from '@/modules/artist/types';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {};

export default function ArtistSelect({ ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { artistsData } = useGetListArtist({});

    return (
        <Select
            {...props}
            options={artistsData.items.map((item: ArtistData) => ({
                id: item.id,
                value: item.id,
                label: item.name,
            }))}
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
