import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
import { ArtistData } from '@/modules/artist/types';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {
    onCreateArtist?: () => void;
};

export default function ArtistSelect({ onCreateArtist, ...props }: Props) {
    const messages = useTranslations();
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
                                onClick={onCreateArtist}
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
